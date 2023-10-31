
const productController = require("../controller/productController");
const multer = require('multer')
const upload = multer({ dest: 'public' })

module.exports = function (app) {

  app.get("/products", productController.getProducts);

  app.get("/products/:id", productController.getProductById);

  app.post("/products", upload.single('file'), productController.saveProduct);

  app.patch("/products/:id", upload.single('file'), productController.updateProduct);

  app.delete("/products/:id", productController.deleteProduct);
};
