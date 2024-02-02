const app = require("./controller/app.js");
const port = 3000;

app.listen(port, () => {
	console.log(`Server listening at: http://localhost:${port}`);
});
