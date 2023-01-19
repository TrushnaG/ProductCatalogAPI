const productController = require("../../controllers/products/products.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/addproduct", productController.AddProduct)
  app.get("/api/getproductlist", productController.getAllProductList);
  app.get("/api/getcategorylist", productController.getAllCategoryList);
  app.get("/api/viewproduct/:slug",  productController.viewProductById);
  app.put("/api/editproduct/:slug", productController.editProductDetailsById);
  app.delete("/api/deleteproduct/:slug", productController.deleteProductById);

};
