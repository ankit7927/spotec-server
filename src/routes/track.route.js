const { appConfig } = require("../config/app.config");
const authModdleware = require("../middleware/auth.middleware");
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

router.route("/listen/:trackId").get(trackService.listenTrack);
router
	.route("/toggel-fav/:trackId")
	.get(authModdleware(), trackService.toggelFav);

module.exports = router;
