const listService = require("../service/list.service");
const trackService = require("../service/track.service");

const router = require("express").Router();

router.get("/home-feed", async (req, res) => {
	const [lists, tracks] = await Promise.all([
		listService.latestLists(),
		trackService.latestTracks(),
	]);
	return res.json({
		lists,
		tracks,
	});
});

router.get("/search", async (req, res) => {
	const query = req.query.query;
	if (!query)
		return res.status(400).json({ error: "Search query is required" });

	try {
		const [tracks, lists] = await Promise.all([
			trackService.searchSong(query),
			listService.searchList(query),
		]);

		return res.json({
			lists: lists.rows,
			tracks: tracks.rows,
		});
	} catch (e) {
		return res.json(e);
	}
});

router.use("/track", require("./track.route"));
router.use("/list", require("./list.route"));
router.use("/user", require("./user.route"));

module.exports = router;
