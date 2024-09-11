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
		},
		album: DataTypes.STRING,
		year: DataTypes.TIME,
		thumbnail: DataTypes.STRING,
		audioFile: DataTypes.STRING,
		audioUrl: DataTypes.STRING,
	},
	{ timestamps: false },
);

module.exports = SongModel;
