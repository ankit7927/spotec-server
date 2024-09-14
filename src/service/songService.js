const SongModel = require("../model/song");
const { Op } = require("sequelize");
const fs = require("fs");
const songService = {};

songService.addSong = async (req, res) => {
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
		let newSong = await SongModel.create({
			title: title,
			album: album,
			artist: artist,
			year: new Date(year),
			audioFile: req.files.audio[0].path,
			thumbnail: thumbnailPath,
		});

		newSong.audioUrl = `${req.protocol}://${req.headers.host}/song/listen/${newSong.id}`;
		newSong = await newSong.save();

		res.status(201).json(newSong);
	} catch (error) {
		res.status(400).json(error);
	}
};

songService.allSongs = async (req, res) => {
	const page = req.query.page ? Number(req.query.page) : 0;
	const limit = req.query.limit ? Number(req.query.limit) : 20;
	const offset = page * limit;

	const songs = await SongModel.findAndCountAll({
		attributes: { exclude: ["audioFile"] },
		offset: offset,
		limit: limit,
	});

	songs.page = page;
	songs.limit = limit;
	return res.json(songs);
};

songService.searchSong = async (req, res) => {
	const query = req.query.query;
	if (!query) return res.json([]);

	const result = await SongModel.findAll({
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
			exclude: ["audioFile"],
		},
	});

	return res.json(result);
};

songService.listenSong = async (req, res) => {
	const songId = req.params.songId;
	console.log(songId);

	if (!songId) return res.status(400).json({ message: "song id required" });

	const range = req.headers.range;
	if (!range) return res.status(400).send("Requires Range header");

	const song = await SongModel.findByPk(songId, {
		attributes: {
			include: ["audioFile"],
		},
	});

	if (!song) return res.status(400).send("song not found");

	const audioSize = fs.statSync(song.audioFile).size;
	const CHUNK_SIZE = 10 ** 6;
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
	const audioStream = fs.createReadStream(song.audioFile, { start, end });
	audioStream.pipe(res);
};

module.exports = songService;
