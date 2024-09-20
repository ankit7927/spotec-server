const listService = require("../service/list.service");

const router = require("express").Router();

router.route("").post(listService.createList).get(listService.allList);
router
	.route("/:listId")
	.delete(listService.deleteList)
	.get(listService.getList);
router
	.route("/tracks")
	.post(listService.addTracks)
	.delete(listService.removeTracks); // fixme this route is not working

module.exports = router;
