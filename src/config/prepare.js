const fs = require("fs");

const prepareDevMode = async () => {
	if (!fs.existsSync("assets")) fs.mkdirSync("assets");
};

module.exports = { prepareDevMode };
