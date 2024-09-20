const multer = require("multer");
const { appConfig } = require("../config/app.config");
const uuidV6 = require("uuid").v6;

const diskStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir =
			appConfig.nodeEnv == "dev"
				? appConfig.middleware.media.devAssetsDir
				: appConfig.middleware.media.proAssetsDir;
		cb(null, dir);
	},
	filename: function (req, file, cb) {
		const ext = file.originalname.split(".").pop();
		const filename = `${uuidV6()}.${ext}`;
		cb(null, filename);
	},
});

const uploadMiddleware = multer({ storage: diskStorage });
module.exports = uploadMiddleware;
