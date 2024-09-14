const uploadMiddleware = require("../middleware/media");
const songService = require("../service/songService");
const router = require("express").Router();

router
	.route("/song")
	.post(
		uploadMiddleware.fields([
			{ name: "audio", maxCount: 1 },
			{ name: "thumbnail", maxCount: 1 },
		]),
		songService.addSong,
	)
	.get(songService.allSongs);

router.route("/search").get(songService.searchSong);
router.route("/listen/:songId").get(songService.listenSong);

module.exports = router;
