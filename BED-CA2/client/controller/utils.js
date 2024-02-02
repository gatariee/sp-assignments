const axios = require("axios");
const path = require("path");

async function verifyToken(req, res, next) {
	const base_api = "http://localhost:3000";
	const path_api = "/api/verify/token/raw";
	const token = req.cookies.token;
	if (!token) {
		res.sendFile(path.join(__dirname, "../public/403.html"));
		return;
	}

	try {
		const decoded = await axios.post(base_api + path_api, {
			token: token,
		});

		if (decoded) {
			const data = decoded.data;
			req.user = data.user;
			req.role = data.role;
			next();
		} else {
			res.sendFile(path.join(__dirname, "../public/403.html"));
		}
	} catch (err) {
		console.log(err);
		res.sendFile(path.join(__dirname, "../public/403.html"));
	}
}

module.exports = {
    verifyToken,
};