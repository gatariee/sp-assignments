const db = require("./db_config");
const crypto = require("crypto");

const authQuery = {
	SHA256: async (password) => {
		const hash = crypto.createHash("sha256");
		hash.update(password);
		const hashedPassword = hash.digest("hex");
		return hashedPassword;
	},

	isAdmin: async (username, password) => {
		console.log("[auth.js] isAdmin() called...");
		if (!password) {
			return false;
		}
		const conn = await db.getConn();
		try {
			const hashedPassword = await authQuery.SHA256(password);
			let sql =
				'SELECT * FROM users WHERE username = ? AND password = ? AND type = "Admin"';
			let results = await db.startQuery(conn, sql, [
				username,
				hashedPassword,
			]);

			if (results.length > 0) {
				console.log("[auth.js] Admin found.");
				return true;
			}
			return false;
		} finally {
			conn.release();
		}
	},
	isUser: async (uid, username, password) => {
		console.log("[auth.js] isUser() called...");
		if (!password) {
			return false;
		}
		const conn = await db.getConn();
		try {
			const hashedPassword = await authQuery.SHA256(password);
			let sql =
				"SELECT * FROM users WHERE userid = ? AND username = ? AND password = ?";
			let results = await db.startQuery(conn, sql, [
				uid,
				username,
				hashedPassword,
			]);

			if (results.length > 0) {
				console.log("[auth.js] User found.");
				return true;
			}
			return false;
		} finally {
			conn.release();
		}
	},
};

module.exports = authQuery;
