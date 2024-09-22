const appConfig = {
	nodeEnv: process.env.NODE_ENV || "dev",
	server: {
		port: process.env.SERVER_PORT,
		cors: {
			allowedHosts: [],
			allowedMethods: [],
		},
	},
	database: {
		devDatabase: {
			dialect: "sqlite",
			storage: "database.sqlite",
			database: "songdb",
		},
		proDatabase: {
			dialect: process.env.DIALECT,
			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			database: process.env.DB_NAME,
			logging: false,
		},
	},
	middleware: {
		media: {
			fields: [
				{ name: "trackFile", maxCount: 1 },
				{ name: "thumbnail", maxCount: 1 },
			],
			devAssetsDir: process.env.DEV_ASSETS_DIR || "assets",
			proAssetsDir: process.env.PRO_ASSETS_DIR,
		},
	},
};

const validateConfig = () => {
	if (!appConfig.nodeEnv || !appConfig.server.port)
		throw new Error("node env or port is not defined in enviroment");

	if (appConfig.nodeEnv == "pro") {
		if (!appConfig.database.proDatabase.dialect)
			throw new Error(
				"production database dialect is not defined in enviroment",
			);

		if (!appConfig.database.proDatabase.username)
			throw new Error(
				"production database username is not defined in enviroment",
			);

		if (!appConfig.database.proDatabase.password)
			throw new Error(
				"production database password is not defined in enviroment",
			);

		if (!appConfig.database.proDatabase.host)
			throw new Error(
				"production database host is not defined in enviroment",
			);

		if (!appConfig.database.proDatabase.port)
			throw new Error(
				"production database port is not defined in enviroment",
			);

		if (!appConfig.database.proDatabase.database)
			throw new Error(
				"production database database is not defined in enviroment",
			);

		if (!appConfig.middleware.media.proAssetsDir)
			throw new Error(
				"production assets dir is not defined in enviroment",
			);

		if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET)
			throw new Error("JWT tokens are not defined in enviroment");
	} else {
		const fs = require("fs");
		if (!fs.existsSync(appConfig.middleware.media.devAssetsDir))
			fs.mkdirSync(appConfig.middleware.media.devAssetsDir);
	}
};

module.exports = { appConfig, validateConfig };
