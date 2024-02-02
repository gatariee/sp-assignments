const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

const multer = require("multer");
const fs = require("fs");

const api = require("../models/api.js");
const auth = require("../models/auth.js");

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
		// 1000 * 1024 = 1 MB
	},
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Endpoint 1: GET /users/
app.get("/users", async (req, res) => {
	try {
		const { username, password } = req.headers;
		const isAuthenticated = await auth.isAdmin(username, password);
		let rawResults = await api.getUsers();

		if (isAuthenticated) {
			res.status(200).send(rawResults);
		} else {
			const redactedFields = ["email", "type", "password", "created_at"];
			let redactedResults = rawResults.map((data) => {
				redactedFields.forEach((key) => delete data[key]);
				return data;
			});

			res.status(200).send(redactedResults);
		}
	} catch (err) {
		res.status(500).send({
			message: "Error while retrieving users",
		});
	}
});

// Endpoint 2: POST /users/
app.post("/users", async (req, res) => {
	let user_details = req.body;
	try {
		const { username, password } = req.headers;
		const isAuthenticated = await auth.isAdmin(username, password);

		if (!isAuthenticated) {
			res.status(403).send({
				message: "You are not authorized to perform this action",
			});
			return;
		}

		const hashedPassword = await auth.SHA256(user_details.password);
		user_details.password = hashedPassword;

		let results = await api.postUsers(user_details);
		let data = {
			userid: results.insertId,
		};
		res.status(201).send(data);
	} catch (err) {
		if (err.errno == 1062) {
			res.status(422).send({
				message: "The email provided already exists.",
			});
		} else {
			res.sendStatus(500);
		}
	}
});

// Endpoint 3: GET /users/:id
app.get("/users/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const { username, password } = req.headers;
		const isAuthenticated = await auth.isAdmin(username, password);

		let rawResults = await api.getUserById(id);
		if (rawResults.length == 0) {
			res.status(404).send({ message: "User not found" });
			return;
		}
		if (isAuthenticated) {
			res.status(200).send(rawResults);
		} else {
			const redactedFields = ["email", "type", "password", "created_at"];
			let redactedResults = rawResults.map((data) => {
				redactedFields.forEach((key) => delete data[key]);
				return data;
			});

			res.status(200).send(redactedResults);
		}
	} catch (err) {
		res.sendStatus(500);
	}
});

// Endpoint 4: POST /category/
app.post("/category", async (req, res) => {
	try {
		let category_details = req.body;
		const { username, password } = req.headers;
		const isAuthenticated = await auth.isAdmin(username, password);
		if (!isAuthenticated) {
			res.status(403).send({
				message: "You are not authorized to perform this action",
			});
			return;
		}
		await api.postCategory(category_details);
		res.sendStatus(201);
	} catch (err) {
		if (err.errno == 1062) {
			res.status(422).send({
				message: "The category provided already exists.",
			});
		} else {
			res.sendStatus(500);
		}
	}
});

// Endpoint 5: POST /platform/
app.post("/platform", async (req, res) => {
	try {
		const { username, password } = req.headers;
		const isAuthenticated = await auth.isAdmin(username, password);
		if (!isAuthenticated) {
			res.status(403).send({
				message: "You are not authorized to perform this action",
			});
			return;
		}
		let platform_details = req.body;
		await api.postPlatform(platform_details);
		res.sendStatus(201);
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
// Endpoint 6: POST /game/
app.post("/game", async (req, res) => {
	try {
		const game_details = req.body;
		const { username, password } = req.headers;
		const isAuthenticated = await auth.isAdmin(username, password);
		if (!isAuthenticated) {
			res.status(403).send({
				message: "You are not authorized to perform this action",
			});
			return;
		}

		let insertId = await api.postGame(game_details);
		res.status(201).send({
			gameid: insertId,
		});
	} catch (err) {
		if (err.errno == 1062) {
			res.status(422).send({
				message: "The game provided already exists.",
			});
		}
	}
});

// Endpoint 7: GET /game/:platform
app.get("/game/:platform", async (req, res) => {
	let platform = req.params.platform;
	try {
		let result = await api.getGamesByPlatform(platform);
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

// Endpoint 8: DELETE /game/:id
app.delete("/game/:id", async (req, res) => {
	let id = req.params.id;
	try {
		const { username, password } = req.headers;
		const isAuthenticated = await auth.isAdmin(username, password);
		if (!isAuthenticated) {
			res.status(403).send({
				message: "You are not authorized to perform this action",
			});
			return;
		}
		let result = await api.deleteGame(id);
		if (result.affectedRows == 0) {
			res.status(404).send({
				message: "Game not found",
			});
		} else {
			res.sendStatus(204);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			message: "Error while deleting game",
		});
	}
});

// Endpoint 9: PUT /game/:id
app.put("/game/:id", async (req, res) => {
	const id = req.params.id;
	const game_details = req.body;
	const { username, password } = req.headers;
	try {
		const isAuthenticated = await auth.isAdmin(username, password);
		if (!isAuthenticated) {
			res.status(403).send({
				message: "You are not authorized to perform this action",
			});
			return;
		}
		await api.updateGame(id, game_details);
		res.sendStatus(204);
	} catch (err) {
		console.error(err);
		res.status(500).send({
			message: "Error while updating game",
			error: err.toString(),
		});
	}
});

// Endpoint 10: POST /user/:uid/game/:gid/review/
app.post("/user/:uid/game/:gid/review", async (req, res) => {
	let uid = req.params.uid;
	let gid = req.params.gid;
	let review_details = req.body;
	try {
		const { username, password } = req.headers;
		const validUser = await auth.isUser(uid, username, password);
		if (!validUser) {
			res.status(403).send({
				message: "You are not authorized to perform this action",
			});
			return;
		}
		const result = await api.postReview(uid, gid, review_details);
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
				message: "The user has already reviewed this game.",
			});
		} else {
			res.sendStatus(500);
		}
	}
});

// Endpoint 11: GET /game/:id/review/
app.get("/game/:id/review", async (req, res) => {
	let id = req.params.id;
	try {
		let result = await api.getReviewByGame(id);
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

// *Additional* Endpoint 12: POST /api/games/:gameId/image
app.post("/api/games/:gameId/image", upload.single("image"), async (req, res) => {
	let gameId = req.params.gameId;
	let image = req.file;
	let { username, password } = req.headers;
	try {
		const isAuthenticated = await auth.isAdmin(username, password);
		if (!isAuthenticated) {
			res.status(403).send({
				message: "You are not authorized to perform this action",
			});
			return;
		}
		await api.postGameImage(gameId, image);
		res.send("Image successfully uploaded to: " + image.path);
	} catch (err) {
		if (image) {
			// Delete image if it was uploaded
			fs.unlink(image.path, (err) => {
				if (err) {
					console.log("error");
					// This should never throw...
					console.error(err);
				}
			});
		}
		res.sendStatus(500);
	}
});
// *Additional* Endpoint 13: GET /api/games/image/search=:searchTerm
app.get("/api/games/image/search=:searchTerm", async (req, res) => {
	let searchTerm = req.params.searchTerm;
	try {
		let results = await api.getGameImage(searchTerm);
		if (results.length == 0) {
			res.status(200).send([]);
		} else {
			let data = results.map((result) => {
				return {
					image: result.image_name,
					title: result.title,
				};
			});

			res.status(200).send(data);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			message: "Error while retrieving games",
		});
	}
});

// *Additional* Endpoint 14: GET /api/games/image/all
app.get("/api/games/image/all", async (req, res) => {
	try {
		let results = await api.getAllGameImages();
		if (results.length == 0) {
			res.status(200).send([]);
		} else {
			let data = results.map((result) => {
				return {
					image: result.image_name,
					title: result.title,
				};
			});

			res.status(200).send(data);
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({
			message: "Error while retrieving games",
		});
	}
});

// *Additional* Endpoint 15: GET /api/games/raw/image/:gameId/
app.get("/api/games/raw/image/:gameId/", async (req, res) => {
	let gameId = req.params.gameId;
	try {
		let result = await api.getGameImageById(gameId);
		if (result.length == 0) {
			res.sendStatus(404)
		} else {
			res.status(200).sendFile(result[0].image_name, {
				root: path.join(__dirname, "../public/images"),
			});
		}
	} catch (err) {
		console.error(err);
		res.status(500).send({ message: "Error while retrieving image" });
	}
});

module.exports = app;
