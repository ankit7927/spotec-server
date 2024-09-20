require("dotenv").config();
const express = require("express");
const sequelize = require("./config/conn.config");
const cors = require("cors");
const { appConfig, validateConfig } = require("./config/app.config");

validateConfig();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

if (appConfig.nodeEnv == "dev") {
	app.use("/assets", express.static(appConfig.middleware.media.devAssetsDir));
	const morgan = require("morgan");
	app.use(morgan("dev"));
}

app.use("/api", require("./routes/api.route"));

(async () => {
	await sequelize.sync();
	sequelize
		.authenticate()
		.then(() => {
			console.log(`\nconnected to database`);
			app.listen(appConfig.server.port, () => {
				console.log(`server started on ${appConfig.server.port}`);
			});
		})
		.catch((err) => {
			throw err;
		});
})();
