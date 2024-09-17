const fileFields = require("../config/media");
const uploadMiddleware = require("../middleware/media");
const trackService = require("../service/trackService");
const router = require("express").Router();

router
	.route("/track")
	.post(uploadMiddleware.fields(fileFields), trackService.addTrack)
	.get(trackService.allTracks);

router.route("/search").get(trackService.searchSong);
router.route("/listen/:trackId").get(trackService.listenTrack);

module.exports = router;
