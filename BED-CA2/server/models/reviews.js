const db = require("../databases/db");

const reviewQuery = {
	postReview: async (uid, gid, review_details) => {
		console.log("[Endpoint 10] postReview() called...");
		const { content, rating } = review_details;
		const conn = await db.getConn();
		try {
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
	getReview: async (game_id) => {
		console.log("[Endpoint 11] getReviewByGame() called...");
		const conn = await db.getConn();
		try {
			const sql = `
            SELECT r.game_id, r.content, r.rating, u.username, r.created_at 
            FROM reviews r
            JOIN users u ON r.user_id = u.userid
            WHERE r.game_id = ?
            `;

			const placeholders = [game_id];
			const results = await db.startQuery(conn, sql, placeholders);

			return results;
		} finally {
			conn.release();
		}
	},
};

module.exports = reviewQuery;
