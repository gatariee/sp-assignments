const db = require("../databases/db");
const utils = require("./utils");

const dbQuery = {
	postLogin: async (username, password) => {
		console.log("[CA2] postLogin() called...");
		const conn = await db.getConn();
		try {
			const sql = `
			SELECT userid, username, password, type FROM users WHERE username = ?
			`;
			const placeholders = [username];
			const results = await db.startQuery(conn, sql, placeholders);

			if (results.length > 0) {
				const hashedPassword = results[0].password;
				const passwordMatch = await utils.SHA256(password);
				if (passwordMatch === hashedPassword) {
					user_details = {
						userid: results[0].userid,
						username: results[0].username,
						type: results[0].type,
					};
					return user_details;
				}
				throw new Error("Incorrect Login");
			}
			throw new Error("Incorrect Login");
		} finally {
			conn.release();
		}
	},
};

module.exports = dbQuery;
