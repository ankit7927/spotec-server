const { appConfig } = require("../config/app.config");
const uploadMiddleware = require("../middleware/media.middleware");
const trackService = require("../service/track.service");
const router = require("express").Router();

router
	.route("")
	.post(
		uploadMiddleware.fields(appConfig.middleware.media.fields),
		trackService.addTrack,
	)
	.get(trackService.allTracks);

router.route("/search").get(trackService.searchSong);
router.route("/listen/:trackId").get(trackService.listenTrack);

module.exports = router;
