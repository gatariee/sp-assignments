const jwt = require("jwt-promise");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const createToken = async (details, role) => {
	const token = await jwt.sign(
		{
			user: details,
			role: role,
		},
		secret,
		{ expiresIn: "1h" }
	);
	return token;
};

const verifyToken = async (token) => {
	try {
		const decoded = await jwt.verify(token, secret);
		return decoded;
	} catch (err) {
		return false;
	}
};

module.exports = {
	createToken,
	verifyToken,
};
