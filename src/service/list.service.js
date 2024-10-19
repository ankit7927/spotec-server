const { Op } = require("sequelize");
const ListModel = require("../model/list.model");
const TrackModel = require("../model/track.model");
const UserModel = require("../model/user.model");
const redisClient = require("../config/redis.config");

const listService = {
	createList: async (req, res) => {
		const data = req.body;
		const user = await UserModel.findByPk(req.user.id);
		const newList = await ListModel.create(data);
		user.addList(newList);
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
		return res.status(200).json({ message: "list deleted" });
	},

	getList: async (req, res) => {
		const listId = req.params.listId;
		let list = await redisClient.get(listId);
		if (list) return res.json(list);

		list = await ListModel.findByPk(listId, {
			include: {
				model: TrackModel,
				attributes: {
					include: ["id", "thumbnail", "title", "album"],
				},
			},
		});

		if (!list) return res.status(400).json({ error: "list not found" });
		await redisClient.set(listId, JSON.stringify(list));
		return res.json(list);
	},

	allList: async (req, res) => {
		result = await ListModel.findAll({
			where: {
				private: false,
			},
			attributes: {
				exclude: ["private"],
			},
		});
		return res.json(result);
	},

	addTracks: async (req, res) => {
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
			return res.json({ message: "tracks added" });
		} catch (error) {
			console.log(error);
			return res.status(400).json(error);
		}
	},

	removeTracks: async (req, res) => {
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

	latestLists: async () => {
		return await ListModel.findAll({
			limit: 4,
			attributes: {
				include: ["id", "name", "description"],
				exclude: ["private"],
			},
			where: {
				private: false,
			},
		});
	},

	searchList: async (query) => {
		return await ListModel.findAndCountAll({
			where: {
				[Op.or]: [
					{
						name: {
							[Op.substring]: query,
						},
					},
					{
						description: {
							[Op.substring]: query,
						},
					},
				],
			},
			limit: 20,
		});
	},
};

module.exports = listService;
