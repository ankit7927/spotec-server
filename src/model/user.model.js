const { DataTypes } = require("sequelize");
const sequelize = require("../config/conn.config");
const TrackModel = require("./track.model");
const ListModel = require("./list.model");

const UserModel = sequelize.define(
	"users",
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
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ timestamps: false },
);

UserModel.hasMany(TrackModel);
TrackModel.belongsToMany(UserModel, {
	through: "favorites",
	timestamps: false,
});

UserModel.hasMany(ListModel);
ListModel.belongsTo(UserModel);

module.exports = UserModel;
