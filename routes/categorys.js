var router = require("express").Router();
var CategoryController = require("../controllers/CategoryController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const categoryValidation = require("../controllers/validations/categoryValidation");

//Admin

router.post("/category/new", auth.require, AdminValidator, categoryValidation.createCategory, CategoryController.createCategory); //testado e aprovado
router.put("/category/:id", auth.require, AdminValidator, categoryValidation.updateCategory, CategoryController.updateCategory); //testado e aprovado
router.get("/categories/unavailable", auth.require, AdminValidator, CategoryController.categoryUnavailable); //testado e aprovado
router.get("/categories", auth.require, AdminValidator, CategoryController.getAllCategories); //testado e aprovado
router.delete("/category/:id/", auth.require, AdminValidator, categoryValidation.removeCategory, CategoryController.removeCategory); //testado e aprovado

router.get("/category/:id/protucts", CategoryController.productCategory); // testado
router.put("/category/:id/products", auth.require, AdminValidator, CategoryController.updateProduct);

// Cliente
router.get("/categories/all", CategoryController.categoryAvailable); // testado
router.get("/category/:id", categoryValidation.categoryDetails, categoryValidation.categoryDetails, CategoryController.categoryDetails);

module.exports = router;
