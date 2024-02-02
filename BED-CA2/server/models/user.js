const db = require("../databases/db");
const utils = require("./utils");

const userQuery = {
	getAllUsers: async () => {
		console.log("[*] user_getUsers() called.");
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
		console.log("[*] getUserById() called...");
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
		const type = "Customer";
		const conn = await db.getConn();
		try {
			const hashedPassword = await utils.SHA256(user.password);
			const sql = `
    INSERT INTO users (username, email, password, type, profile_pic_url) VALUES (?, ?, ?, ?, ?)`;
			const placeholders = [
				user.username,
				user.email,
				hashedPassword,
				type,
				user.profile_pic_url,
			];
			const result = await db.startQuery(conn, sql, placeholders);
			return result;
		} finally {
			conn.release();
		}
	},
	searchUsers: async (searchTerm) => {
		const conn = await db.getConn();
		try {
			const sql = `
			SELECT * FROM users WHERE username RLIKE ?
			`;
			const placeholders = [searchTerm];
			const results = await db.startQuery(conn, sql, placeholders);
			return results;
		} finally {
			conn.release();
		}
	},
};

module.exports = userQuery;
