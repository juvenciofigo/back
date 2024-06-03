var express = require("express");
var router = express.Router();
var CartController = require("../controllers/CartController");

// router.get("/carts/", CartController.listCarts);

router.get("/cart/:userId/prices", CartController.showDetailsCartPrices); //Retrieve items in the cart for a specific user.
router.post("/cart/:userId/products", CartController.showDetailsCart); //Retrieve items in the cart for a specific user.

router.post("/carts/:user_id", CartController.createCart);

router.post("/cart/:userId/addProduct", CartController.addProductsCart); //Add a product to a user's cart.

router.delete("/cart/:userId/remove/:productId", CartController.removeProductCart); //Remove a product from a user's cart.

router.put("/cart/:userId/update/:productId/:quantity", CartController.updateQuantity); //Update quantity of a product in the cart.

module.exports = router;
