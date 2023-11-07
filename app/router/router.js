
const productControllerFromDataBase = require("../controller/productControllerFromDataBase");
const multer = require('multer')
const upload = multer({ dest: 'public' })

module.exports = function (app) {

  app.get("/products", productControllerFromDataBase.getProducts);

  app.get("/products/:id", productControllerFromDataBase.getProductById);

  app.post("/products", upload.single('file'), productControllerFromDataBase.saveProduct);

  app.patch("/products/:id", upload.single('file'), productControllerFromDataBase.updateProduct);

  app.delete("/products/:id", productControllerFromDataBase.deleteProduct);
};
