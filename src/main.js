require("dotenv").config();
const express = require("express");
const sequelize = require("./config/conn");
const cors = require("cors")
const { prepareDevMode } = require("./config/prepare");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV == "dev") {
	prepareDevMode();
	app.use("/assets/thumbnails", express.static("assets/thumbnails"));
	const morgan = require("morgan");
	app.use(morgan("dev"));
}

app.use("/song", require("./routes/songRoute"));

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
