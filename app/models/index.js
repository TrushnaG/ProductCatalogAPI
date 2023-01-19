const dbConfig = require("../config/db.config")
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

const db = {};
db.products = require("./products.model")(sequelize, Sequelize);
db.categories = require("./categories.model")(sequelize, Sequelize);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.products.belongsTo(db.categories, { foreignKey: "category_id", as: "category" });
module.exports = db;