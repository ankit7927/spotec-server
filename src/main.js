require("dotenv").config();
const express = require("express");
const sequelize = require("./config/conn.config");
const cors = require("cors");
const { appConfig, validateConfig } = require("./config/app.config");
const redisClient = require("./config/redis.config");

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
		.then(async () => {
			console.log(`\nconnected to database`);

			redisClient.on("error", (error) =>
				console.error(`Error : ${error}`),
			);
			redisClient.on("connect", () => console.log("connected to redis"));
			await redisClient.connect();

			app.listen(appConfig.server.port, () => {
				console.log(`server started on ${appConfig.server.port}`);
			});
		})
		.catch((err) => {
			throw err;
		});
})();
