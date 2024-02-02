const mysql = require("mysql");
// https://stackoverflow.com/questions/54730641/node-js-how-to-apply-util-promisify-to-mysql-pool-in-its-simplest-way

console.log("[db_config.js] Initializing DB Connection Pool...");
const dbPool = mysql.createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "root",
	password: "[redacted]",
	database: "main",
	port: 3306,
	dateStrings: true,
});

console.log(
	"[db_config.js] DB Connection OK. " +
		dbPool.config.connectionLimit +
		" concurrent connections allowed."
);
// console.log("[db_config.js] DB Connection Pool initialized: " + dbPool.config.connectionLimit + " connections allowed")

let dbConn = {
	getConn: () => {
		console.log("[db_config.js] DB Connection requested");
		console.log(
			"[db_config.js] DB Connection Pool: " +
				dbPool._allConnections.length +
				" connections"
		);
		// if this number increases, it means that there is a leaked connection somewhere
		// check finally block for db.release()

		return new Promise((resolve, reject) => {
			dbPool.getConnection((err, conn) => {
				if (err) {
					console.error("[db_config.js] DB Connection Error: " + err);
					reject(err);
				} else {
					console.log("[db_config.js] DB Connection OK.");
					resolve(conn);
				}
			});
		});
	},
	startQuery(conn, sql, params) {
		return new Promise((resolve, reject) => {
			conn.query(sql, params, (err, results) => {
				if (err) {
					reject(err);
				} else {
					resolve(results);
				}
			});
		});
	},
};

module.exports = dbConn;
