const fs = require("fs");

const prepareDevMode = async () => {
	if (!fs.existsSync("assets")) fs.mkdirSync("assets");
	if (!fs.existsSync("assets/audios")) fs.mkdirSync("assets/audios");
	if (!fs.existsSync("assets/thumbnails")) fs.mkdirSync("assets/thumbnails");
};

module.exports = { prepareDevMode };
