module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.FLOAT,
    },
    slug:{
      type: Sequelize.STRING,
    },
    category_id: {
      type: Sequelize.INTEGER,
    },
    deletedAt: {
      type: Sequelize.DATE
    },
  }, { paranoid: true });
  return Product;
};
