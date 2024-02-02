const crypto = require("crypto");

const authQuery = {
	SHA256: async (password) => {
		const hash = crypto.createHash("sha256");
		hash.update(password);
		const hashedPassword = hash.digest("hex");
		return hashedPassword;
	}
};

module.exports = authQuery;
