const { Op } = require("sequelize");
const ListModel = require("../model/list");
const TrackModel = require("../model/track");

const listService = {
	createList: async (req, res) => {
		const data = req.body;
		const newList = await ListModel.create(data);
		return res.json(newList);
	},

	updateList: async (req, res) => {
		const { id, name, private, description } = req.body;
		const list = await ListModel.findByPk(id);
		if (!list) return res.status(400).json({ error: "list not found" });
		list.set({
			name: name,
			private: private,
			description: description,
		});
		const upated = await list.save();
		return res.json(upated);
	},

	deleteList: async (req, res) => {
		const listId = req.params.listId;
		const list = await ListModel.findByPk(listId);
		if (!list) return res.status(400).json({ error: "list not found" });
		await list.destroy();
	},

	getList: async (req, res) => {
		const listId = req.params.listId;
		const list = await ListModel.findByPk(listId, {
			include: {
				model: TrackModel,
				attributes: {
					include: ["id", "thumbnail", "title", "album"],
				},
			},
		});

		if (!list) return res.status(400).json({ error: "list not found" });
		return res.json(list);
	},

	allList: async (req, res) => {
		const result = await ListModel.findAll({
			where: {
				private: false,
			},
			attributes: {
				exclude: ["private"],
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

	removeTrack: async (req, res) => {
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

			await list.removeTracks(tracks);
			return res.json(list);
		} catch (error) {
			console.log(error);
			return res.status(400).json(error);
		}
	},
};

module.exports = listService;
