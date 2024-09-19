const { DataTypes } = require("sequelize");
const sequelize = require("../config/conn");
const TrackModel = require("./track");

const ListModel = sequelize.define(
	"lists",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
		},
		private: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{ timestamps: false },
);

ListModel.hasMany(TrackModel);
TrackModel.belongsToMany(ListModel, { through: "junction", timestamps: false });

module.exports = ListModel;
