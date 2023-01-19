const { sequelize } = require("../../models");
const db = require("../../models");
const commonService = require("./service");
const commonResponse = require("./common.response");
const message = require("./message");
const Op = db.Sequelize.Op;

const Product = db.products;
const Category = db.categories;

//get all category list
exports.getAllCategoryList = (req, res, next) => {
      Category.findAll({
        order: [["id", "ASC"]],
        attributes: ["id", "name"],
      }).then(async data => {
        const responseData = JSON.parse(JSON.stringify(data));
        res.status(200).json({ success: "true", message: message.GET_CATEGORY_SUCCESS, data: responseData })
      }).catch(err => {
        res.status(200).json({ success: "false", message: err.message });
      });
  
}

//Add product
exports.AddProduct = (req, res, next) => {
  if(req.body.title == "" || !req.body.title){
    return res.status(200).json({
      success:"false",
      message:message.REQUIRED_FIELD
    })
  }
      const slug = commonService.generateSlug(req.body.title);
      commonService.uniqueTitleValidation( req.body.title).then((isUnique) => {
        if (isUnique) {
              Product.create({
                title: req.body.title,
                description: req.body.description,
                category_id: req.body.category_id,
                price: req.body.price,
                slug: slug,
              }).then((productData) => {
                const response = commonResponse.createProductRes(productData)
                res.status(200).json({ success: "true", message: message.CREATE_PRODUCT_SUCCESS, data: response })
              }).catch((err) => { res.status(200).json({ success: 'false', message: err.message }) });
                  } else {
          res.status(200).json({ success: 'false', message: message.TITLE_DUPLICATE });
        }
      }).catch(err => { res.status(200).json({ success: "false", message: err.message }) })
}

//get all product list
exports.getAllProductList = (req, res, next) => {
      const { page, size, s } = req.query;
      var Condition = {};
      if (s) {
        Condition = {
          ...Condition,
          [Op.or]: [{
            title: {
              [Op.iLike]: `%${s}%`
            }
          }, {
            '$category.name$': {
              [Op.iLike]: `%${s}%`
            }
          },]
        };
      }
      const { limit, offset } = commonService.getPagination(page, size);
      Product.findAndCountAll({
        where: [ Condition],
        order: [["id", "DESC"]],
        attributes: ["id", "title", "description", "category_id", "slug", "price"],
        include:[{model: Category, as: "category", attributes:["id", "name"]}],
        limit, offset
      }).then(async data => {
        const response = commonService.getPagingData(data, page, limit);
        var responseData = JSON.parse(JSON.stringify(response))
        res.status(200).json({ success: "true", message: message.GET_PRODUCT_SUCCESS, data: responseData })
      }).catch(err => {
        res.status(200).json({ success: "false", message: err.message });
      });
 
}

//view product by id
exports.viewProductById = (req, res, next) => {
  const slug = req.params.slug;
      Product.findOne({
        where: { slug: slug },
        attributes: ["id", "title", "description", "category_id", "slug", "price"],
        include:[{model: Category, as: "category", attributes:["id", "name"]}]
            }).then(async data => {
        if (data) {
          const responseData = JSON.parse(JSON.stringify(data))
          res.status(200).json({ success: "true", message: message.GET_USER_SUCCESS, data: responseData })
        } else {
          res.status(200).json({ success: "false", message: message.NO_PRODUCT })
        }
      }).catch(err => {
        res.status(200).json({ success: "false", message: err.message });
      });
  
}

//edit product details by id
exports.editProductDetailsById = (req, res, next) => {
  const slug = req.params.slug;
      Product.findOne({
        where: { slug: slug },
        attributes: ["id", "title", "description", "category_id", "slug", "price"],
      }).then(async data => {
        if (data) {
              commonService.titleValidationForEdit(req.body.title, data.id).then((isUnique) => {
                if (isUnique) {
                  const newData = {
                    title: req.body.title,
                    description: req.body.description,
                    category_id: req.body.category_id,
                    price:  req.body.price,
                  }
                  Product.update(newData, { where: { id: data.id } }).then(num => {
                    if (num != 0) {
                      res.status(200).json({ success: "true", message: message.UPDATE_PRODUCT_SUCCESS, data: newData })
                    } else {
                      res.status(200).json({ success: "false", message: message.UPDATE_PRODUCT_FAILED })
                    }
                  }).catch(err => { res.status(200).json({ success: 'false', message: err.message }) });
                } else {
                  res.status(200).send({ success: 'false', message: message.TITLE_DUPLICATE });
                }
              }).catch(err => { res.status(200).json({ success: "false", message: err.message }) })
                } else {
          res.status(200).json({ success: "false", message: message.NO_PRODUCT })
        }
      }).catch(err => { res.status(200).json({ success: "false", message: err.message }) });
    
}

//delete product by id
exports.deleteProductById = (req, res, next) => {
  const slug = req.params.slug;
      Product.findOne({ where: { slug: slug } }).then(async data => {
        if (data) {
              Product.destroy({ where: { id: data.id } }).then(async (num) => {
                if (num != 0) {
                  res.status(200).json({ success: "true", message: message.DELETE_PRODUCT_SUCCESS })
                } else {
                  res.status(200).json({ success: "false", message: message.DELETE_PRODUCT_FAILED })
                }
              }).catch((err) => { res.status(200).json({ success: 'false', message: err.message }) })
        } else {
          res.status(200).json({ success: "false", message: message.NO_PRODUCT })
        }
      }).catch(err => { res.status(200).json({ success: "false", message: err.message }); });
   
}
