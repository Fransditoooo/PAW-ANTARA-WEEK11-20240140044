const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Lainnya",
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },

  {
    tableName: "products",
    timestamps: true,
  }
);

module.exports = Product;