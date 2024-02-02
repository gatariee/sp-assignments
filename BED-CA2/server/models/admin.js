const db = require("../databases/db");
const utils = require("./utils");

/* 

Contains all queries for admin related functions- regardless of which table it is referencing.

*/

const adminQuery = {
	getAllUsers: async () => {
		console.log("[*] admin_getAllUsers() called.");
		const conn = await db.getConn();
		try {
			const sql = `SELECT * FROM users`;
			const placeholders = [];
			const result = await db.startQuery(conn, sql, placeholders);
			return result;
		} finally {
			conn.release();
		}
	},
	getUserByID: async (id) => {
		console.log("[*] admin_getUserById() called...");
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
	registerUser: async (user) => {
		const conn = await db.getConn();
		try {
			const hashedPassword = await utils.SHA256(user.password);
			const sql = `INSERT INTO users (username, email, password, type, profile_pic_url) VALUES (?, ?, ?, ?, ?)`;
			const placeholders = [
				user.username,
				user.email,
				hashedPassword,
				user.type,
				user.profile_pic_url,
			];
			const result = await db.startQuery(conn, sql, placeholders);
			return result;
		} finally {
			conn.release();
		}
	},
	addCategory: async (details) => {
		const conn = await db.getConn();
		try {
			const sql = `INSERT INTO categories (category_name, description) VALUES (?, ?)
            `;
			const placeholders = [details.catname, details.description];
			const result = await db.startQuery(conn, sql, placeholders);
			return result;
		} finally {
			conn.release();
		}
	},
	postPlatform: async (details) => {
		const { platform_name, description } = details;
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
};

module.exports = adminQuery;
