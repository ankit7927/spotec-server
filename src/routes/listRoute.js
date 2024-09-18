const listService = require("../service/listService");

const router = require("express").Router();

router.route("/list").post(listService.createList).get(listService.allList);
router.route("/add-tracks").post(listService.addTrack);

module.exports = router;
