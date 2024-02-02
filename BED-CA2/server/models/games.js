const db = require("../databases/db");

const gameQuery = {
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
    getGame: async (searchTerm) => {
		console.log("[Additional Endpoint 1] getGameImage() called...");
		const conn = await db.getConn();
		try {
			const sql = `
			SELECT g.gameid, g.title, g.description, g.year, g.created_at, g.image_name,
			GROUP_CONCAT(c.category_id SEPARATOR ", ") AS catid, GROUP_CONCAT(c.category_name SEPARATOR ', ') AS catname,
			p.platform_name AS platform, pp.price
			FROM games g
			JOIN game_category gc ON g.gameid = gc.game_id
			JOIN categories c ON gc.category_id = c.category_id
			JOIN game_platform_price pp ON g.gameid = pp.gameid
			JOIN platform p ON pp.platformid = p.platform_id
			WHERE g.title RLIKE ?
			GROUP BY g.gameid, g.title, g.description, g.year, g.created_at, g.image_name, p.platform_name, pp.price;
			`;
			const placeholders = [searchTerm];
			const results = await db.startQuery(conn, sql, placeholders);

			return results;
		} finally {
			conn.release();
		}
	},
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
	getAllGames: async () => {
		console.log("[Additional Endpoint 3] getAllGameImages() called...");
		const conn = await db.getConn();
		try {
			const sql = `
			SELECT g.gameid, g.title, g.description, g.year, g.created_at, g.image_name,
			GROUP_CONCAT(c.category_id SEPARATOR ", ") AS catid, GROUP_CONCAT(c.category_name SEPARATOR ', ') AS catname,
			p.platform_name AS platform, pp.price
			FROM games g
			JOIN game_category gc ON g.gameid = gc.game_id
			JOIN categories c ON gc.category_id = c.category_id
			JOIN game_platform_price pp ON g.gameid = pp.gameid
			JOIN platform p ON pp.platformid = p.platform_id
			GROUP BY g.gameid, g.title, g.description, g.year, g.created_at, g.image_name, p.platform_name, pp.price;
		  `;
			const results = await db.startQuery(conn, sql);

			return results;
		} finally {
			conn.release();
		}
	},
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
	},
};

module.exports = gameQuery;