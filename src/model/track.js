const { DataTypes } = require("sequelize");
const sequelize = require("../config/conn");

const TrackModel = sequelize.define(
	"tracks",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		album: DataTypes.STRING,
		artist: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		year: DataTypes.TIME,
		thumbnail: DataTypes.STRING,
		trackFile: DataTypes.STRING
	},
	{ timestamps: false },
);

module.exports = TrackModel;
