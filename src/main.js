require("dotenv").config();
const express = require("express");
const sequelize = require("./config/conn");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

if (process.env.NODE_ENV == "dev") {
	const { prepareDevMode } = require("./config/prepare");
	prepareDevMode();
	app.use("/assets", express.static("assets"));
	const morgan = require("morgan");
	app.use(morgan("dev"));
}

app.use("/api", require("./routes/trackRoute"));

(async () => {
	await sequelize.sync();
	sequelize
		.authenticate()
		.then(() => {
			console.log(`\nconnected to database`);
			app.listen(port, () => {
				console.log(`server started on ${port}`);
			});
		})
		.catch((err) => {
			throw err;
		});
})();
