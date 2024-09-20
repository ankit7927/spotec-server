const { Sequelize } = require("sequelize");
const { appConfig } = require("./app.config");

const sequelize = new Sequelize(
	appConfig.nodeEnv == "dev"
		? appConfig.database.devDatabase
		: appConfig.database.proDatabase,
);

module.exports = sequelize;
