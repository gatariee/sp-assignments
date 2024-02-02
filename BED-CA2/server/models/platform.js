const db = require("../databases/db");

const platformQuery = {
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
	getPlatforms: async () => {
		const conn = await db.getConn();
		try {
			const sql = `
            SELECT platform_id, platform_name FROM platform;
            `;
			const results = await db.startQuery(conn, sql);
			return results;
		} finally {
			conn.release();
		}
	},
};

module.exports = platformQuery;
