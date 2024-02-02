const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const verifyToken = require("./utils").verifyToken;

app.use(express.static(path.join(__dirname, "../public")));

app.use(cookieParser());

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.get("/register", (req, res) => {
	res.sendFile(path.join(__dirname, "../public/register.html"));
});

app.get("/games", (req, res) => {
	res.sendFile(path.join(__dirname, "../public/games.html"));
});

app.get("/users", verifyToken, (req, res) => {
	res.sendFile(path.join(__dirname, "../public/users.html"));
});

app.get("/admin", verifyToken, (req, res) => {
	if (req.role === "Admin") {
		res.sendFile(path.join(__dirname, "../public/admin.html"));
	} else {
		res.sendFile(path.join(__dirname, "../public/403.html"));
	}
});

app.get("/logout", (req, res) => {
	res.sendFile(path.join(__dirname, "../public/logout.html"));
});

app.use("*", (req, res, next) => {
	/**
	 * If none of the above routes are hit, then send a 404.
	 */
	res.status(404).sendFile(path.join(__dirname, "../public/404.html"));
});

module.exports = app;
