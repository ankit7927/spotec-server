const { Op } = require("sequelize");
const ListModel = require("../model/list");
const TrackModel = require("../model/track");

const listService = {
	createList: async (req, res) => {
		const data = req.body;
		const newList = await ListModel.create(data);
		return res.json(newList);
	},
	allList: async (req, res) => {
		const result = await ListModel.findAll({
			where: {
				private: false,
			},
			include: {
				model: TrackModel,
				attributes: ["id", "title", "album", "artist"],
			},
		});
		return res.json(result);
	},
	addTrack: async (req, res) => {
		const { trackIds, listId } = req.body;
		try {
			if (trackIds.length == 0)
				return res.status(400).json({ error: "track ids are empty" });

			const list = await ListModel.findByPk(listId, {
				include: TrackModel,
			});

			if (!list) return res.status(400).json({ error: "list not found" });

			const tracks = await TrackModel.findAll({
				where: {
					id: {
						[Op.in]: trackIds,
					},
				},
			});

			await list.addTracks(tracks);

			return res.json(list);
		} catch (error) {
			console.log(error);

			return res.status(400).json(error);
		}
	},
};

module.exports = listService;
