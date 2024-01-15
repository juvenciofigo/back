var express = require("express");
var router = express.Router();
var CartController = require("../controllers/CartController");

// router.get("/cart/:userId", CartController.listCarts); //Retrieve items in the cart for a specific user.

router.post('/carts/:user_id', CartController.createCart)

// router.post("/cart/:userId/add/:productId", CartController.addProtuctsCart); //Add a product to a user's cart.

// router.delete("/cart/:userId/remove/:productId"); //Remove a product from a user's cart.

// router.put("/cart/:userId/update/:productId"); //Update quantity of a product in the cart.


module.exports = router;
 