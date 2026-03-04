import { Router } from "express";
const router = Router();
import {
    createCartController,
    IsAuthValidator,
    getCartsController,
    IsAdminValidator,
    addProductToCartController,
    updateProductQuantityController,
    removeProductToCartController,
    getCartDetailsController,
    getCartTotalController,
    updateQuantityValidator,
    removeItemValidator,
} from "./index.js";

router.post("/cart", IsAuthValidator.require, createCartController); //👌

router.post("/cart/item", IsAuthValidator.require, addProductToCartController);

router.get("/carts/admin", IsAuthValidator.require, IsAdminValidator, getCartsController); //👌

router.delete("/cart/item/:itemId", removeItemValidator, IsAuthValidator.require, removeProductToCartController); //👌

router.patch("/cart/item/:itemId/:quantity", updateQuantityValidator, IsAuthValidator.require, updateProductQuantityController);

router.post("/cart/details", IsAuthValidator.optional, getCartDetailsController); //Retrieve items in the cart for a specific user.

router.post("/cart/total", IsAuthValidator.optional, getCartTotalController); //Retrieve only the total price for the specific user's cart

export default router;
