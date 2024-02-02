/**
 * @fileoverview This file handles all the backend API endpoints.
 * @
 */




const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const api = require("../models/api.js");
const user = require("../models/user.js");
const jwt = require("../models/jwt.js");
const games = require("../models/games.js");
const admin = require("../models/admin.js");
const category = require("../models/categories.js");
const platform = require("../models/platform.js");
const review = require("../models/reviews.js");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/images/");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1 * 1024 * 1024,
	},
});

const isVerified = async (req, res, next) => {
	/**
	 * @note - This is a middleware function that handles whether the JWT provided matches an admin user
	 * @matches - The JWT must match an admin user
	 */
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = await jwt.verifyToken(token);
		if (!decoded) {
			res.status(401).send({ message: "Unauthorized" });
			return;
		} else {
			req.role = decoded.role;
			req.userID = decoded.id;
			next();
		}
	} catch (err) {
		res.status(401).send({ message: "No token provided" });
		return;
	}
};

const isVerifiedReview = async (req, res, next) => {
	/**
	 * @note - This is a middleware function that handles whether the JWT provided matches the user ID of the review
	 * @matches - The JWT must match the user ID of the review
	 * @knownIssue - This function currently only works for ONE API endpoint as the URL.split is hardcoded 
	 * @possibleFix - Fetch the UserID dynamically using the req.params object
	 */
	try {
		const token = req.headers.authorization.split(" ")[1];
		console.log(`[SERVER] isVerifiedReview token: ${token}`)
		const decoded = await jwt.verifyToken(token);
		const url_parts = req.url.split("/")
		const givenID = url_parts[5];
		const actualID = decoded.user.userid
		console.log(`
			[SERVER] isVerifiedReview
			decoded: ${JSON.stringify(decoded)}
			givenID: ${givenID}
			actualID: ${actualID}
			`)
		if (!decoded) {
			res.status(401).send({ message: "Unauthorized" });
			return;
		} else if (givenID != actualID) {
			res.status(401).send({ message: "Unauthorized" });
			return;
		} else {
			req.role = decoded.role;
			req.userID = decoded.id;
			next();
		}
	} catch (err) {
		res.status(401).send({ message: "No token provided" });
		return;
	}
};

app.get("/api/v1/users/all", async (req, res) => {
	/**
	 * @auth - Open API endpoint
	 */
	console.log("[SERVER] GET /api/v1/users/all");
	try {
		let results = await user.getAllUsers();
		const redactedFields = ["email", "password"];
		results = results.map((data) => {
			redactedFields.forEach((key) => delete data[key]);
			return data;
		});
		res.status(200).send(results);
	} catch (err) {
		console.log(err);
		res.status(500).send({
			message: "Error while retrieving users",
		});
	}
});

app.get("/api/v1/users/:id", async (req, res) => {
	/**
	 * @auth - Open API endpoint
	 */
	console.log("[SERVER] GET /api/v1/users/:id");
	try {
		const id = req.params.id;

		let results = await user.getUserByID(id);

		if (results.length == 0) {
			res.status(404).send({ message: "User not found" });
			return;
		}

		const redactedFields = ["email", "password"];
		results = results.map((data) => {
			redactedFields.forEach((key) => delete data[key]);
			return data;
		});
		res.status(200).send(results);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

app.get("/api/v1/query/users/search=:searchTerm", async (req, res) => {
	/**
	 * @auth - Open API endpoint
	 */
	try {
		const searchTerm = req.params.searchTerm;
		let results = await user.searchUsers(searchTerm);
		if (results.length == 0) {
			res.status(404).send({ message: "No users found" });
			return;
		}
		const redactedFields = ["email", "password"];
		results = results.map((data) => {
			redactedFields.forEach((key) => delete data[key]);
			return data;
		});
		res.status(200).send(results);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

app.post("/api/v1/user", async (req, res) => {
	/**
	 * @auth - Open API endpoint
	 * @note - Used for registering new users
	 */
	let user_details = req.body;
	const expectedFields = ["username", "email", "password", "profile_pic_url"];
	const missingFields = [];
	if (Object.keys(user_details).length > expectedFields.length) {
		res.status(400).send({
			error: "Too many fields in request body",
		});
		return;
	}

	expectedFields.forEach((field) => {
		if (!(field in user_details)) {
			missingFields.push(field);
		}
	});
	if (missingFields.length > 0) {
		res.status(400).send({
			error: "Missing fields in request body",
			missingFields: missingFields,
		});
		return;
	}

	try {
		let results = await user.registerUser(user_details);
		let data = {
			userid: results.insertId,
		};
		res.status(200).send(data);
	} catch (err) {
		if (err.errno == 1062) {
			res.status(409).send({
				error: "Username or email already exists",
			});
			return;
		}
		console.log(err);
		res.status(500).send({
			error: "Error while registering user",
		});
	}
});

app.get("/api/admin/users/all", isVerified, async (req, res) => {
	/**
	 * @auth - Admin only
	 * @note - Get all users, this also returns emails & passwords
	 */
	try {
		let results = await admin.getAllUsers();
		res.status(200).send(results);
	} catch (err) {
		console.log(err);
		res.status(500).send({
			message: "Error while retrieving users",
		});
	}
});

app.get("/api/admin/users/:id", isVerified, async (req, res) => {
	/**
	 * @auth - Admin only
	 */
	try {
		const id = req.params.id;
		let results = await admin.getUserByID(id);
		if (results.length == 0) {
			res.status(404).send({ message: "User not found" });
			return;
		}
		res.status(200).send(results);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
});

app.post("/api/admin/user", isVerified, async (req, res) => {
	/**
	 * @auth - Admin only
	 * @note - Used for registering new users, this also allows to specify whether the user is an admin or not
	 */
	let types = ["Admin", "Customer"];
	let user_details = req.body;
	const expectedFields = [
		"username",
		"email",
		"password",
		"profile_pic_url",
		"type",
	];
	const missingFields = [];
	if (Object.keys(user_details).length > expectedFields.length) {
		res.status(400).send({
			message: "Too many fields in request body",
		});
		return;
	}

	expectedFields.forEach((field) => {
		if (!(field in user_details)) {
			missingFields.push(field);
		}
	});
	if (missingFields.length > 0) {
		res.status(400).send({
			message: "Missing fields in request body",
			missingFields: missingFields,
		});
		return;
	}

	if (!types.includes(user_details.type)) {
		res.status(400).send({
			message: "Invalid user type",
			availableTypes: types,
		});
		return;
	}

	try {
		let results = await admin.registerUser(user_details);
		let data = {
			userid: results.insertId,
		};
		res.status(200).send(data);
	} catch (err) {
		if (err.errno == 1062) {
			res.status(409).send({
				message: "Username or email already exists",
			});
			return;
		}
		console.log(err);
		res.status(500).send({
			message: "Error while registering user",
		});
	}
});

app.post("/api/admin/category", isVerified, async (req, res) => {
	/**
	 * @auth - Admin only
	 * @note - Used for adding new categories
	 */
	let category_details = req.body;
	const expectedFields = ["catname", "description"];
	const missingFields = [];
	if (Object.keys(category_details).length > expectedFields.length) {
		res.status(400).send({
			message: "Too many fields in request body",
		});
		return;
	}

	expectedFields.forEach((field) => {
		if (!(field in category_details)) {
			missingFields.push(field);
		}
	});
	if (missingFields.length > 0) {
		res.status(400).send({
			message: "Missing fields in request body",
			missingFields: missingFields,
		});
		return;
	}

	try {
		let results = await admin.addCategory(category_details);
		let data = {
			catid: results.insertId,
		};
		res.status(200).send(data);
	} catch (err) {
		if (err.errno == 1062) {
			res.status(409).send({
				message: "Category already exists",
			});
			return;
		}
		console.log(err);
		res.status(500).send({
			message: "Error while adding category",
		});
	}
});

app.post("/api/admin/platform", isVerified, async (req, res) => {
	/**
	 * @auth - Admin only
	 * @note - Used for adding new platforms
	 */
	try {
		const platform_details = req.body;
		const expected_fields = ["platform_name", "description"];
		const missing_fields = [];
		if (Object.keys(platform_details).length > expected_fields.length) {
			res.status(400).send({
				message: "Too many fields in request body",
			});
			return;
		}

		expected_fields.forEach((field) => {
			if (!(field in platform_details)) {
				missing_fields.push(field);
			}
		});
		if (missing_fields.length > 0) {
			res.status(400).send({
				message: "Missing fields in request body",
				missing_fields: missing_fields,
			});
			return;
		}

		const result = await admin.postPlatform(platform_details);
		if (result.affectedRows == 0) {
			/**
			 * @note - This should never happen, the only error that should be thrown is duplicate platform 
			 */
			res.status(500).send({
				message:
					"Something went very wrong, please contact your system administrator",
			});
		} else {
			res.status(201).send({
				platformid: result.insertId,
			});
		}
	} catch (err) {
		if (err.errno == 1062) {
			res.status(422).send({
				message: "The platform provided already exists.",
			});
		} else {
			res.sendStatus(500);
		}
	}
});

app.post("/api/admin/game", isVerified, async (req, res) => {
	/**
	 * @auth - Admin only
	 * @note - Used for adding new games
	 */
	try {
		const game_details = req.body;
		const required_fields = [
			"title",
			"description",
			"price",
			"platform_id",
			"category_id",
			"year",
			"image_url",
		];
		const missing_fields = [];
		required_fields.forEach((field) => {
			if (!(field in game_details)) {
				missing_fields.push(field);
			}
		});

		if (missing_fields.length > 0) {
			res.status(400).send({
				message: "Missing fields in request body",
				missing_fields: missing_fields,
			});
			return;
		}

		if (
			game_details.price.split(",").length !==
			game_details.platform_id.split(",").length
		) {
			return res.status(400).json({
				error: "Number of prices should match number of platforms",
			});
		}

		/**
		 * @note - Check if platform IDs are unique, sets remove duplicates
		 */
		if (
			new Set(game_details.platform_id.split(",")).size !==
			game_details.platform_id.split(",").length
		) {
			return res
				.status(400)
				.json({ error: "Platform IDs should be unique" });
		}

		for (const field in game_details) {
			switch (field) {
				case "title":
				case "description":
				case "year":
				case "image_url":
					if (typeof game_details[field] !== "string") {
						return res
							.status(400)
							.json({ error: `${field} should be a string` });
					}
					break;
				case "price":
					if (typeof game_details.price !== "string") {
						return res
							.status(400)
							.json({ error: "Price should be a string" });
					}
					const prices = game_details.price.split(",");
					if (
						!prices.every((price) =>
							/^\d+(\.\d{1,2})?$/.test(price)
						)
					) {
						return res.status(400).json({
							error: "Price should be a comma-separated string of numbers",
							example: "1.00,2.50,3.00",
						});
					}
					break;
				case "platform_id":
				case "category_id":
					if (typeof game_details[field] !== "string") {
						return res
							.status(400)
							.json({ error: `${field} should be a string` });
					}
					const ids = game_details[field].split(",");
					if (!ids.every((id) => /^\d+$/.test(id))) {
						return res.status(400).json({
							error: `${field} should be a comma-separated string of numbers`,
						});
					}
					break;
				default:
					return res
						.status(400)
						.json({ error: `Invalid field: ${field}` });
			}
		}

		const insertId = await admin.postGame(game_details);
		res.status(201).send({
			gameid: insertId,
		});
	} catch (err) {
		if (err.errno) {
			if (err.errno == 1062) {
				res.status(422).send({
					message: "The title provided already exists.",
				});
			} else {
				res.sendStatus(500);
			}
		} else {
			res.status(400).send({
				message: err.message,
			});
		}
	}
});

app.get("/api/v1/game/:platform", async (req, res) => {
	/**
	 * @note - Used for retrieving games by platform
	 * @auth - Open API endpoint
	 */
	let platform = req.params.platform;
	try {
		let result = await games.getGamesByPlatform(platform);
		if (result.length == 0) {
			res.status(404).send({
				message: "Game not found",
			});
		} else {
			res.status(200).send(result);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			message: "Error while retrieving game",
		});
	}
});

app.delete("/api/admin/game/:id", isVerified, async (req, res) => {
	/**
	 * @auth - Admin only
	 * @note - Used for deleting games
	 */
	let id = req.params.id;
	try {
		const result = await admin.deleteGame(id);
		if (result.affectedRows == 0) {
			res.status(404).send({
				message: "Game not found",
			});
		} else {
			res.status(204).send({ message: "Game deleted successfully" });
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			message: "Error while deleting game",
		});
	}
});

app.put("/api/admin/game/:id", isVerified, async (req, res) => {
	const id = req.params.id;
	const game_details = req.body;
	try {
		await admin.updateGame(id, game_details);
		res.sendStatus(204);
	} catch (err) {
		console.error(err);
		res.status(500).send({
			message: "Error while updating game",
			error: err.toString(),
		});
	}
});

app.post("/api/v1/reviews/uid/:uid/gid/:gid", isVerifiedReview, async (req, res) => {
	/**
	 * @auth - User only, middleware checks if user is verified
	 * @note - Used for posting reviews
	 */
	let uid = req.params.uid;
	let gid = req.params.gid;
	let review_details = req.body;

	const expected_fields = ["content", "rating"];
	for (const field of expected_fields) {
		if (!review_details[field]) {
			res.status(400).send({
				message: `Missing ${field} in request body`,
			});
			return;
		}
	}

	const additional_fields = Object.keys(review_details).filter(
		(field) => !expected_fields.includes(field)
	);

	if (additional_fields.length > 0) {
		res.status(400).send({
			message: `Unexpected fields: ${additional_fields.join(", ")}`,
		});
		return;
	}

	try {
		const result = await review.postReview(uid, gid, review_details);
		const data = {
			reviewid: result.insertId,
		};
		res.status(201).send(data);
	} catch (err) {
		if (err.message == "GID") {
			res.status(422).send({
				message: "The game provided does not exist.",
			});
		} else if (err.message == "UNIQUE") {
			res.status(422).send({
				message: "You have already reviewed this game.",
			});
		} else {
			res.status(500).send({
				message: "Error while posting review",
			});
		}
	}
});

app.get("/api/reviews/:id", async (req, res) => {
	/**
	 * @note - Used for retrieving reviews by game id
	 * @auth - Open API endpoint
	 */
	let id = req.params.id;
	try {
		let result = await review.getReview(id);
		if (result.length == 0) {
			res.status(404).send({ message: "Review not found" });
		} else {
			res.status(200).send(result);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({ message: "Error while retrieving review" });
	}
});

app.post(
	"/api/games/:gameId/image",
	isVerified,
	upload.single("image"),
	async (req, res) => {
		/**
		 * @auth - Admin
		 * @note - Currently unused endpoint for uploading images
		 */
		let gameId = req.params.gameId;
		let image = req.file;
		try {
			await games.postGameImage(gameId, image);

			/**
			 * @considerations - This image currently does not exist in the server, edit accordingly to upload to your frontend
			 * @recommendations - Upload the image offsite and store the url in the databse so it is rebuilt client-side.
			 */
			res.send("Image successfully uploaded to: " + image.path);
		} catch (err) {
			if (image) {
				fs.unlink(image.path, (err) => {
					if (err) {
						console.error(err);
					}
				});
			}
			res.sendStatus(500);
		}
	}
);

app.get("/api/games/search=:searchTerm", async (req, res) => {
	/**
	 * @note - Used for searching games by name
	 * @auth - Open API endpoint
	 */
	let searchTerm = req.params.searchTerm;
	try {
		let results = await games.getGame(searchTerm);
		if (results.length == 0) {
			res.status(200).send([]);
		} else {
			res.status(200).send(results);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			message: "Error while retrieving games",
		});
	}
});

app.get("/api/games/all", async (req, res) => {
	/**
	 * @note - Used for retrieving all games
	 * @auth - Open API endpoint
	 */
	try {
		let results = await games.getAllGames();
		if (results.length == 0) {
			res.status(200).send([]);
		} else {
			res.status(200).send(results);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			message: "Error while retrieving games",
		});
	}
});

app.get("/api/games/raw/image/:gameId/", async (req, res) => {
	/**
	 * @note - Used for retrieving images by game id
	 * @auth - Open API endpoint
	 */
	let gameId = req.params.gameId;
	try {
		let result = await games.getGameImageById(gameId);
		if (result.length == 0) {
			res.sendStatus(404);
		} else {
			// res.status(200).sendFile(result[0].image_name, {
			// 	root: path.join(__dirname, "../public/images"),
			// });

			res.status(200).send(result[0].image_name);
			/**
			 * @note - This returns the name of the image file, not the image itself.
			 * @recommendations - Return a link to an off-site hosted image instead, then rebuild it clientside @see POST /api/games/:gameId/image
			 */
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({ message: "Error while retrieving image" });
	}
});

app.post("/api/login", async (req, res) => {
	/**
	 * @note - Used for logging in given a username and password
	 * @auth - Open API endpoint
	 * @important - Ensure that this endpoint remains secure against SQLi at all times
	 * @recommendations - Sanitize the username & password field before passing it into the login function
	 */
	const { username, password } = req.body;
	const expected_fields = ["username", "password"];
	for (const field of expected_fields) {
		if (!(field in req.body)) {
			res.status(400).send({ message: `Missing field: ${field}` });
			return;
		}
	}
	const additional_fields = Object.keys(req.body).filter(
		(field) => !expected_fields.includes(field)
	);

	if (additional_fields.length > 0) {
		res.status(400).send({
			message: `Unexpected field(s): ${additional_fields.join(", ")}`,
		});
		return;
	}

	try {
		const result = await api.postLogin(username, password);
		const token = await jwt.createToken(result, result.type);
		res.cookie("session", token, {
			httpOnly: true,
			maxAge: 3600000,
			sameSite: "strict",
		});

		res.status(200).send({
			message: "Login successful",
			token: token,
		});
	} catch (err) {
		console.error(err);
		res.status(401).send({ message: "Login unsuccessful" });
	}
});

app.post("/api/verify/token", async (req, res) => {
	/**
	 * @note - Used for verifying a token
	 * @auth - Open API endpoint
	 */
	const { token } = req.body;
	if (!token) {
		res.status(400).send({ message: "Missing token" });
		return;
	}
	try {
		const result = await jwt.verifyToken(token);
		if (result) {
			res.status(200).send({ ok: true });
		} else {
			res.status(401).send({ ok: false });
		}
	} catch (err) {
		console.error(err);
		res.status(401).send({ message: "Invalid token" });
	}
});

app.post("/api/verify/token/raw", async (req, res) => {
	/**
	 * @note - Used for verifying a token
	 * @auth - Open API endpoint
	 * @considerations - This API can be used to brute force tokens
	 */
	const { token } = req.body;
	if (!token) {
		res.status(400).send({ message: "Missing token" });
		return;
	}
	try {
		const result = await jwt.verifyToken(token);
		if (result) {
			res.status(200).send(result);
		} else {
			res.status(401).send({ ok: false });
		}
	} catch (err) {
		console.error(err);
		res.status(401).send({ message: "Invalid token" });
	}
});

app.get("/api/platforms/all", async (req, res) => {
	/**
	 * @note - Used for retrieving all platforms
	 * @auth - Open API endpoint
	 */
	try {
		let results = await platform.getPlatforms();
		if (results.length == 0) {
			res.status(200).send([]);
		} else {
			let parsed_results = [];
			for (let i = 0; i < results.length; i++) {
				parsed_results.push({
					id: results[i].platform_id,
					platformName: results[i].platform_name,
				});
			}
			res.status(200).send(parsed_results);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			message: "Error while retrieving platforms",
		});
	}
});

app.get("/api/categories/all", async (req, res) => {
	/**
	 * @note - Used for retrieving all categories
	 * @auth - Open API endpoint
	 */
	try {
		let results = await category.getCategories();
		if (results.length == 0) {
			res.status(200).send([]);
		} else {
			let parsed_results = [];
			for (let i = 0; i < results.length; i++) {
				parsed_results.push({
					id: results[i].category_id,
					categoryName: results[i].category_name,
				});
			}
			res.status(200).send(parsed_results);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			message: "Error while retrieving categories",
		});
	}
});

module.exports = app;
