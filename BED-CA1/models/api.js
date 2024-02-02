const db = require("./db_config");

var dbQuery = {
	// Endpoint 1: GET /users/
	getUsers: async () => {
		console.log("[Endpoint 1] getUsers() called...");
		const conn = await db.getConn();
		try {
			const sql = `
            SELECT * FROM users
            `;
			const placeholders = [];
			const results = await db.startQuery(conn, sql, placeholders);
			return results;
		} finally {
			conn.release();
		}
	},

	// Endpoint 2: POST /users/
	postUsers: async (user) => {
		console.log("[Endpoint 2] postUsers() called...");
		const conn = await db.getConn();
		try {
			const sql = `
            INSERT INTO users (username, email, password, type, profile_pic_url) VALUES (?, ?, ?, ?, ?)
            `;
			const placeholders = [
				user.username,
				user.email,
				user.password,
				user.type,
				user.profile_pic_url,
			];

			const results = await db.startQuery(conn, sql, placeholders);
			return results;
		} finally {
			conn.release();
		}
	},

	// Endpoint 3: GET /users/:id
	getUserById: async (id) => {
		console.log("[Endpoint 3] getUserById() called...");
		const conn = await db.getConn();
		try {
			const sql = `
            SELECT * FROM users WHERE userid = ?
            `;
			const placeholders = [id];
			const results = await db.startQuery(conn, sql, placeholders);
			return results;
		} finally {
			conn.release();
		}
	},

	// Endpoint 4: POST /category/
	postCategory: async (cat_details) => {
		console.log("[Endpoint 4] postCategory() called...");
		const conn = await db.getConn();
		try {
			const sql = `
            INSERT INTO categories (category_name, description) VALUES (?, ?)
            `;
			const placeholders = [cat_details.catname, cat_details.description];
			const results = await db.startQuery(conn, sql, placeholders);

			return results;
		} finally {
			conn.release();
		}
	},

	// Endpoint 5: POST /platform/
	postPlatform: async (platform_details) => {
		console.log("[Endpoint 5] postPlatform() called...");
		const { platform_name, description } = platform_details;
		const conn = await db.getConn();
		try {
			const sql = `
            INSERT INTO platform (platform_name, description) VALUES (?, ?);
            `;
			const placeholders = [platform_name, description];
			const results = await db.startQuery(conn, sql, placeholders);

			return results;
		} finally {
			conn.release();
		}
	},
	// Endpoint 6: POST /game/
	postGame: async (gameDetails) => {
		const {
			title,
			description,
			price,
			platform_id,
			category_id,
			year,
			image_url,
		} = gameDetails;
		const conn = await db.getConn();

		try {
			const platformIdArray = platform_id.split(",");
			const priceArray = price.split(",");
			const categoryIdArray = category_id.split(",");
			if (platformIdArray.length !== priceArray.length) {
				throw new Error("Platform and price array length mismatch");
			}

			const checkPlatformSql = `SELECT platform_id FROM platform WHERE FIND_IN_SET(platform_id, ?);`;
			const checkCategorySql = `SELECT category_id FROM categories WHERE FIND_IN_SET(category_id, ?);`;
			const [checkPlatformResult, checkCategoryResult] =
				await Promise.all([
					db.startQuery(conn, checkPlatformSql, platform_id),
					db.startQuery(conn, checkCategorySql, category_id),
				]);

			if (checkPlatformResult.length !== platformIdArray.length) {
				throw new Error("One or more platform id does not exist");
			}

			if (checkCategoryResult.length !== categoryIdArray.length) {
				throw new Error("One or more category id does not exist");
			}

			const insertGameSql = `
            INSERT INTO games (title, description, year, image_name)
            VALUES (?, ?, ?, ?);
          `;
			const insertGamePlaceholder = [title, description, year, image_url];
			const insertGameResult = await db.startQuery(
				conn,
				insertGameSql,
				insertGamePlaceholder
			);
			const gameId = insertGameResult.insertId;

			const insertGamePlatformPriceSql = `
            INSERT INTO game_platform_price (gameid, platformid, price)
            VALUES (?, ?, ?);
          `;
			const insertGameCategorySql = `
            INSERT INTO game_category (game_id, category_id)
            VALUES (?, ?);
          `;

			const insertGamePlatformPricePromises = platformIdArray.map(
				(platformId, index) => {
					let price = priceArray[index]; // this only works if the index matches btw, which it should
					return db.startQuery(conn, insertGamePlatformPriceSql, [
						gameId,
						platformId,
						price,
					]);
				}
			);

			const insertGameCategoryPromises = categoryIdArray.map(
				(categoryId) => {
					return db.startQuery(conn, insertGameCategorySql, [
						gameId,
						categoryId,
					]);
				}
			);

			const queryPromises = [
				...insertGamePlatformPricePromises,
				...insertGameCategoryPromises,
			];

			await Promise.all(queryPromises);
			return gameId;
		} finally {
			conn.release();
		}
	},
	// Endpoint 7: GET /game/:platform
	getGamesByPlatform: async (platform) => {
		console.log("[Endpoint 7] getGamesByPlatform() called...");
		const conn = await db.getConn();

		try {
			const sql = `
            SELECT g.gameid, g.title, g.description, pp.price, p.platform_name AS platform, 
            GROUP_CONCAT(c.category_id SEPARATOR ", ") AS catid, GROUP_CONCAT(c.category_name SEPARATOR ', ') AS catname, g.year, g.created_at
            FROM games g
            JOIN game_category gc ON g.gameid = gc.game_id
            JOIN categories c ON gc.category_id = c.category_id
            JOIN game_platform_price pp ON g.gameid = pp.gameid
            JOIN platform p ON pp.platformid = p.platform_id
            WHERE p.platform_name = ?
            GROUP BY g.gameid, g.title, g.description, pp.price;
            `;
			const placeholders = [platform];
			const results = await db.startQuery(conn, sql, placeholders);

			return results;
		} finally {
			conn.release();
		}
	},
	// Endpoint 8: DELETE /game/:id
	deleteGame: async (id) => {
		console.log("[Endpoint 8] deleteGame() called...");
		const conn = await db.getConn();
		try {
			const sql = `
            DELETE FROM games WHERE gameid = ?
            `;
			const placeholders = [id];
			const results = await db.startQuery(conn, sql, placeholders);

			return results;
		} finally {
			conn.release();
		}
	},
	// Endpoint 9: PUT /game/:id
	updateGame: async (id, game_details) => {
		const {
			title,
			description,
			price,
			platformid,
			categoryid,
			year,
			image_url,
		} = game_details;
		const conn = await db.getConn();

		try {
			const platformIdArray = platformid.split(",");
			const priceArray = price.split(",");
			const categoryIdArray = categoryid.split(",");
			if (platformIdArray.length !== priceArray.length) {
				throw new Error("Platform and price array length mismatch");
			}
			const checkGameExistSql = `SELECT gameid FROM games WHERE gameid = ?`;
			const checkPlatformSql = `SELECT platform_id FROM platform WHERE FIND_IN_SET(platform_id, ?);`;
			const checkCategorySql = `SELECT category_id FROM categories WHERE FIND_IN_SET(category_id, ?);`;

			const [
				checkPlatformResult,
				checkCategoryResult,
				checkGameExistResult,
			] = await Promise.all([
				db.startQuery(conn, checkPlatformSql, platformid),
				db.startQuery(conn, checkCategorySql, categoryid),
				db.startQuery(conn, checkGameExistSql, id),
			]);
			if (checkPlatformResult.length !== platformIdArray.length) {
				throw new Error("One or more platform id does not exist");
			}

			if (checkCategoryResult.length !== categoryIdArray.length) {
				throw new Error("One or more category id does not exist");
			}

			if (checkGameExistResult.length === 0) {
				throw new Error("Game ID does not exist");
			}

			const updateGamePlatformPriceSql = `
			UPDATE game_platform_price
			SET price = ?
			WHERE gameid = ? AND platformid = ?;
			`;

			const updateGameCategorySql = `
			UPDATE game_category
			SET category_id = ?
			WHERE game_id = ? AND category_id = ?;
			`;

			const updateGameSql = `
			UPDATE games
			SET title = ?, description = ?, year = ?, image_name = ?
			WHERE gameid = ?;
			`;

			const updateGamePlaceholder = [
				title,
				description,
				year,
				image_url,
				id,
			];
			const updateGamePlatformPricePromises = platformIdArray.map(
				(platformId, index) => {
					let price = priceArray[index]; // same as POST /game, index must match
					return db.startQuery(conn, updateGamePlatformPriceSql, [
						price,
						id,
						platformId,
					]);
				}
			);

			const updateGameCategoryPromises = categoryIdArray.map(
				(categoryId) => {
					return db.startQuery(conn, updateGameCategorySql, [
						categoryId,
						id,
						categoryId,
					]);
				}
			);

			const queryPromises = [
				...updateGamePlatformPricePromises,
				...updateGameCategoryPromises,
				db.startQuery(conn, updateGameSql, updateGamePlaceholder),
			];

			await Promise.all(queryPromises);
		} catch (err) {
			if (err.errno === 1062) {
				throw new Error(
					"Title already exists, perhaps you mistyped the GameID?"
				);
			}
			throw err;
		} finally {
			conn.release();
		}
	},
	// Endpoint 10: POST /user/:uid/game/:gid/review/
	postReview: async (uid, gid, review_details) => {
		console.log("[Endpoint 10] postReview() called...");
		const { content, rating } = review_details;
		const conn = await db.getConn();
		try {
			// UID checking is done via middleware (auth.js)
			const validate_gid = `SELECT * FROM games WHERE gameid = ?`;
			const validate_unique = `SELECT * FROM reviews WHERE user_id = ? AND game_id = ?`;

			const [valid_gid, valid_unique] = await Promise.all([
				db.startQuery(conn, validate_gid, [gid]),
				db.startQuery(conn, validate_unique, [uid, gid]),
			]);

			if (valid_gid.length == 0) {
				throw new Error("GID");
			}

			if (valid_unique.length != 0) {
				throw new Error("UNIQUE");
			}

			const sql = `
            INSERT INTO reviews (user_id, game_id, content, rating) VALUES (?, ?, ?, ?)
            `;

			const placeholders = [uid, gid, content, rating];
			const results = await db.startQuery(conn, sql, placeholders);

			return results;
		} finally {
			conn.release();
		}
	},
	// Endpoint 11: GET/game/:id/review/
	getReviewByGame: async (id) => {
		console.log("[Endpoint 11] getReviewByGame() called...");
		const conn = await db.getConn();
		try {
			const sql = `
            SELECT r.game_id, r.content, r.rating, u.username, r.created_at 
            FROM reviews r
            JOIN users u ON r.user_id = u.userid
            WHERE r.game_id = ?
            `;

			const placeholders = [id];
			const results = await db.startQuery(conn, sql, placeholders);

			return results;
		} finally {
			conn.release();
		}
	},
	// Additional Endpoint 1: GET /games/search=:searchTerm
	getGameImage: async (searchTerm) => {
		console.log("[Additional Endpoint 1] getGameImage() called...");
		const conn = await db.getConn();
		try {
			const sql =
				"SELECT image_name, title FROM games WHERE title RLIKE ?";
			const placeholders = [searchTerm];
			const results = await db.startQuery(conn, sql, placeholders);

			return results;
		} finally {
			conn.release();
		}
	},
	// Additional Endpoint 2: POST /games/:id/image
	postGameImage: async (gameId, image) => {
		console.log("[Additional Endpoint 2] postGameImage() called...");
		const conn = await db.getConn();
		try {
			const sql = "UPDATE games SET image_name = ? WHERE gameid = ?";
			const placeholders = [image.filename, gameId];
			const results = await db.startQuery(conn, sql, placeholders);

			return results;
		} finally {
			conn.release();
		}
	},
	// Additional Endpoint 3: GET /games/image/all
	getAllGameImages: async () => {
		console.log("[Additional Endpoint 3] getAllGameImages() called...");
		const conn = await db.getConn();
		try {
			const sql = "SELECT image_name, title FROM games";
			const results = await db.startQuery(conn, sql);

			return results;
		} finally {
			conn.release();
		}
	},
	// Additional Endpoint 4: GET /games/raw/image/:gameId
	getGameImageById: async (gameId) => {
		console.log("[Additional Endpoint 4] getGameImageById() called...");
		const conn = await db.getConn();
		try {
			const sql = "SELECT image_name FROM games WHERE gameid = ?";
			const placeholders = [gameId];
			const results = await db.startQuery(conn, sql, placeholders);

			return results;
		} finally {
			conn.release();
		}
	}
};

module.exports = dbQuery;
