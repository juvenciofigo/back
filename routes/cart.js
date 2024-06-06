var express = require("express");
var router = express.Router();
var CartController = require("../controllers/CartController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");

router.get("/carts", auth.require, AdminValidator, CartController.allCarts);

router.get("/cart/:userId/prices", auth.require, CartController.showDetailsCartPrices); //Retrieve items in the cart for a specific user.
router.post("/cart/:userId/products", CartController.showDetailsCart); //Retrieve items in the cart for a specific user.

router.post("/carts/:user_id", auth.require, CartController.createCart);

router.post("/cart/:userId/addProduct", auth.require, CartController.addProductsCart); //Add a product to a user's cart.

router.delete("/cart/:userId/remove/:productId", auth.require, CartController.removeProductCart); //Remove a product from a user's cart.

router.put("/cart/:userId/update/:productId/:quantity", auth.require, CartController.updateQuantity); //Update quantity of a product in the cart.

module.exports = router;
