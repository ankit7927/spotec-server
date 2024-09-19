const listService = require("../service/listService");

const router = require("express").Router();

router.route("/list").post(listService.createList).get(listService.allList);
router
	.route("/list/:listId")
	.delete(listService.deleteList)
	.get(listService.getList);
router
	.route("/tracks")
	.post(listService.addTrack)
	.delete(listService.removeTrack);

module.exports = router;
