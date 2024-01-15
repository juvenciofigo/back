var express = require("express");
var router = express.Router();
var ProductController = require("../controllers/ProductController");

router.post("/newProduct", ProductController.createProduct); //Create a product
router.get("/products", ProductController.listProtucts); //All products
router.get("/products/:id", ProductController.showDetailsProduct); //one product details
router.patch("/products/:id", ProductController.updateproduct); //Edit
router.delete("/products/:id", ProductController.deletecProduct); //Excluir um produto.

module.exports = router;
