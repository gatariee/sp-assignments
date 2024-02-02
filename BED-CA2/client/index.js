const app = require("./controller/router.js");
const port = 80;

app.listen(port, () => {
	console.log(`[Frontend] Server listening at: http://localhost:${port}`);
});
