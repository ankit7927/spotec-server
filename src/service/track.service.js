const TrackModel = require("../model/track.model");
const { Op } = require("sequelize");
const redisClient = require("../config/redis.config");
const fs = require("fs");
const ListModel = require("../model/list.model");
const UserModel = require("../model/user.model");
const trackService = {};

trackService.addTrack = async (req, res) => {
	const { title, artist, album, year } = req.body;

	// TODO check weather [req.files.thumbnail[0].path]
	// will return absolute path of file. like http://somehost/shdg/image.jpg
	// there for we have to change thumbnail and audio path

	const filePath =
		req.files.thumbnail == null
			? "public/notfound.jpg"
			: req.files.thumbnail[0].path;

	const thumbnailPath = `${req.protocol}://${req.headers.host}/${filePath}`;

	try {
		let newTrack = await TrackModel.create({
			title: title,
			album: album,
			artist: artist,
			year: new Date(year),
			trackFile: req.files.trackFile[0].path,
			thumbnail: thumbnailPath,
		});

		res.status(201).json(newTrack);
	} catch (error) {
		res.status(400).json(error);
	}
};

trackService.allTracks = async (req, res) => {
	const page = req.query.page ? Number(req.query.page) : 0;
	const limit = req.query.limit ? Number(req.query.limit) : 20;
	const offset = page * limit;

	const tracks = await TrackModel.findAndCountAll({
		attributes: { exclude: ["trackFile"] },
		offset: offset,
		limit: limit,
	});

	const lists = await ListModel.findAll({
		limit: 5,
		where: {
			private: false,
		},
	});

	tracks.lists = lists;
	tracks.page = page;
	tracks.limit = limit;
	return res.json(tracks);
};

trackService.latestTracks = async () => {
	return await TrackModel.findAll({
		limit: 10,
		attributes: {
			exclude: ["year", "trackFile", "listId"],
		},
	});
};

trackService.searchSong = async (query) => {
	return await TrackModel.findAndCountAll({
		where: {
			[Op.or]: [
				{
					title: {
						[Op.substring]: query,
					},
				},
				{
					album: {
						[Op.substring]: query,
					},
				},
			],
		},
		attributes: {
			exclude: ["trackFile"],
		},
		limit: 20,
	});
};

trackService.toggelFav = async (req, res) => {
	const [user, track] = Promise.all([
		UserModel.findByPk(req.user.id),
		TrackModel.findByPk(req.params.trackId),
	]);

	if (!track) return res.status(404).json({ message: "Track not found" });

	const isFav = await user.hasTrack(track);

	if (isFav) {
		await user.removeTrack(track);
		return res.json({ message: "removed from fav" });
	} else {
		await user.addTrack(track);
		return res.json({ message: "added to fav" });
	}
};

// TODO use redis cache
trackService.listenTrack = async (req, res) => {
	const trackId = req.params.trackId;

	if (!trackId) return res.status(400).json({ message: "Track ID required" });

	const range = req.headers.range;
	if (!range)
		return res.status(400).json({ message: "Requires Range header" });

	try {
		let track = await redisClient.get(trackId);
		track = JSON.parse(track);

		if (!track) {
			track = await TrackModel.findByPk(trackId, {
				attributes: ["trackFile"],
			});

			if (!track)
				return res.status(404).json({ message: "Track not found" });
			await redisClient.set(trackId, JSON.stringify(track));
		}

		const trackFile = track.trackFile;
		const audioSize = fs.statSync(trackFile).size;
		const CHUNK_SIZE = 10 ** 6; // 1 MB chunk size
		const start = Number(range.replace(/\D/g, ""));
		const end = Math.min(start + CHUNK_SIZE, audioSize - 1);
		const contentLength = end - start + 1;

		const headers = {
			"Content-Range": `bytes ${start}-${end}/${audioSize}`,
			"Accept-Ranges": "bytes",
			"Content-Length": contentLength,
			"Content-Type": "audio/mp3",
		};

		res.writeHead(206, headers);

		const audioStream = fs.createReadStream(trackFile, { start, end });

		audioStream.on("error", (error) => {
			console.error("Stream error:", error);
			res.sendStatus(500);
		});

		audioStream.pipe(res);
	} catch (error) {
		console.error("Error handling the request:", error);
		res.sendStatus(500);
	}
};

module.exports = trackService;
