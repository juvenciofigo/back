const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const productValidation = require("../controllers/validations/productValidation");
const upload = require("../config/multer");

// Admin

router.post("/product/new", auth.require, AdminValidator, productValidation.Create, ProductController.createProduct); // testado

router.put("/product/:id", auth.require, AdminValidator, productValidation.Update, ProductController.updateProduct); // testado

router.put("/product/image/:id", auth.require, AdminValidator, productValidation.Image, upload.array("files", 5), ProductController.updateImage); // tstando e aprovado

router.delete("/product/:id", auth.require, AdminValidator, productValidation.Delete, ProductController.deleteProduct);

router.get("/products/all", auth.require, AdminValidator, productValidation.All, ProductController.getAllProductsAdmin);

//Cliente

router.get("/product/:id", productValidation.getBtId, ProductController.showDetailsProduct); //testado
router.get("/products", productValidation.All, ProductController.getAllProducts);
router.get("/products/search/:search", ProductController.searchProducts); // nao aprovado

//Ratings
router.get("/product/:id/ratings", productValidation.getBtId, ProductController.getRatingsProduct);

//Variations
router.get("/product/:id/variations", productValidation.getBtId, ProductController.getVariationsProduct);

module.exports = router;
