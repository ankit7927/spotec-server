const multer = require("multer");

const diskStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.mimetype == "image/jpeg") cb(null, "assets/thumbnails");
		else if (file.mimetype == "audio/mpeg") cb(null, "assets/audios");
	},
	filename: function (req, file, cb) {
		const ext = file.originalname.split(".").pop();
		const filename = `${Date.now()}.${ext}`;
		cb(null, filename);
	},
});

const uploadMiddleware = multer({ storage: diskStorage });
module.exports = uploadMiddleware;
