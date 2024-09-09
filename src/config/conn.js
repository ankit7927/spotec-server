const { Sequelize } = require("sequelize");

const devConfig = {
	dialect: "sqlite",
	storage: "database.sqlite",
	database: "songdb",
};

const proConfig = {
	dialect: "mysql",
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	logging: false,
};

const sequelize = new Sequelize(
	process.env.NODE_ENV == "dev" ? devConfig : proConfig,
);

module.exports = sequelize;
