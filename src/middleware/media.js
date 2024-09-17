const multer = require("multer");
const uuidV6 = require("uuid").v6

const diskStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "assets");
	},
	filename: function (req, file, cb) {
		const ext = file.originalname.split(".").pop();
		const filename = `${uuidV6()}.${ext}`;
		cb(null, filename);
	},
});

const uploadMiddleware = multer({ storage: diskStorage });
module.exports = uploadMiddleware;
