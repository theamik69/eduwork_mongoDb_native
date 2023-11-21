
const productControllerMongoDb = require("../controller/productControllerMongoDb");

module.exports = function (app) {

  app.get("/products", productControllerMongoDb.getProducts);

  app.get("/products/:id", productControllerMongoDb.getProductById);

  app.post("/products", productControllerMongoDb.saveProduct);

  app.patch("/products/:id", productControllerMongoDb.updateProduct);

  app.delete("/products/:id", productControllerMongoDb.deleteProduct);
};
