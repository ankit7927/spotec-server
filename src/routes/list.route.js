const listService = require("../service/list.service");
const authModdleware = require("../middleware/auth.middleware");

const router = require("express").Router();

router
	.route("")
	.post(authModdleware(), listService.createList)
	.get(listService.allList);
router
	.route("/:listId")
	.delete(listService.deleteList)
	.get(listService.getList);
router
	.route("/tracks")
	.post(authModdleware(), listService.addTracks)
	.delete(authModdleware(), listService.removeTracks); // fixme this route is not working

module.exports = router;
