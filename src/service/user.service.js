const UserModel = require("../model/user.model");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const TrackModel = require("../model/track.model");
const ListModel = require("../model/list.model");
const redisClient = require("../config/redis.config");
const userService = {};

userService.login = async (req, res) => {
	const data = req.body;

	if (!data.email || !data.password)
		return res.status(403).json({ message: "all fields required" });

	const exists = await UserModel.findOne({
		where: {
			email: data.email,
		},
	});

	if (!exists) return res.status(403).json({ message: "user not exists" });
	if (bcrypt.compareSync(data.password, exists.password)) {
		const access = jwt.sign(
			{
				user: {
					name: exists.name,
					id: exists.id,
					email: exists.email,
				},
			},
			process.env.ACCESS_SECRET,
			{ expiresIn: "1h" },
		);

		const refresh = jwt.sign(
			{
				user: {
					name: exists.name,
					id: exists.id,
					email: exists.email,
				},
			},
			process.env.REFRESH_SECRET,
			{ expiresIn: "7d" },
		);

		return res.json({ refresh, access, id: exists.id });
	} else {
		return res.status(403).json({ message: "wrong password" });
	}
};

userService.newAccessToken = async (req, res) => {
	const userdata = req.user;
	const newAccess = jwt.sign(
		{
			...userdata,
		},
		process.env.ACCESS_SECRET,
		{ expiresIn: "1h" },
	);

	return res.json({ access: newAccess });
};

userService.register = async (req, res) => {
	const data = req.body;

	if (!data.name || !data.email || !data.password)
		return res.status(403).json({ message: "all fields required" });

	const exists = await UserModel.findOne({
		where: {
			email: data.email,
		},
	});

	if (exists) return res.status(403).json({ message: "user exists" });

	data.password = bcrypt.hashSync(data.password);

	const newUser = await UserModel.create(data);

	if (newUser) return res.json({ message: "user created" });
	else return res.status(402).json({ message: "wrong data provided" });
};

userService.getUser = async (req, res) => {
	let user = await redisClient.get(req.user.id);
	if (user) return res.json(user);

	user = await UserModel.findOne({
		where: {
			id: req.user.id,
		},
		attributes: {
			exclude: ["password"],
		},
		include: [
			{
				model: TrackModel,
				attributes: {
					exclude: ["trackFile", "year", "artist"],
				},
			},
			ListModel,
		],
	});

	await redisClient.set(req.user.id, JSON.stringify(user))
	return res.json(user);
};

module.exports = userService;
