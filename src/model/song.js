const { DataTypes } = require("sequelize");
const sequelize = require("../config/conn");

const SongModel = sequelize.define(
	"songs",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			unique:true
		},
		album: DataTypes.STRING,
		artist: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		composer: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		genre: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		lyrics: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		year: DataTypes.TIME,
		thumbnail: DataTypes.STRING,
		audioFile: DataTypes.STRING,
		audioUrl: DataTypes.STRING,
	},
	{ timestamps: false },
);

module.exports = SongModel;
