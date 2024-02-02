const db = require("../databases/db");

/**
 * This file is for queries that are related to the categories table BUT do not require administrative access
 *
 */
const categoryQuery = {
	getCategories: async () => {
		const conn = await db.getConn();
		try {
			const sql = `
            SELECT category_id, category_name FROM categories;
            `;
			const results = await db.startQuery(conn, sql);

			return results;
		} finally {
			conn.release();
		}
	},
};


module.exports = categoryQuery;