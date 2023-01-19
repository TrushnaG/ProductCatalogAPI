const db = require('../../models');
const { v4: uuidv4 } = require('uuid');
uuidv4();
const _ = require("lodash");
const slugify = require('slugify');
const Product = db.products;
const Op = db.Sequelize.Op;

module.exports = {
  getPagination: (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  },
  getPagingData: (alldata, page, limit) => {
    const { count: totalItems, rows: data } = alldata;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, data, totalPages, currentPage };
  },
  generateSlug: (name) => {
    const uniqueId = uuidv4().substring(0, 4);
    const slug = `${slugify(`${(name).substr(0, 8)}`, { lower: true })}-${uniqueId}`;
    return slug;
  },
  uniqueTitleValidation: (title) => {
    return Product.count({ where: [{ title: title }] }).then((count) => {
      if (count != 0) {
        return false;
      }
      return true;
    });
  },
  titleValidationForEdit: (title, id) => {
    return Product.count({ where: [{ id: { [Op.ne]: id } }, { title: title }] }).then((count) => {
      if (count != 0) {
        return false;
      }
      return true;
    });
  },
}

