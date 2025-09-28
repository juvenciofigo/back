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
    updateQuantityValidator,
    removeItemValidator,
} from "./index.js";

router.post("/cart", IsAuthValidator.require, createCartController); //👌

router.post("/cart/product", IsAuthValidator.require, addProductToCartController);

router.get("/carts/admin", IsAuthValidator.require, IsAdminValidator, getCartsController); //👌

router.delete("/cart/product/:itemId", removeItemValidator, IsAuthValidator.require, removeProductToCartController); //👌

router.patch("/cart/product/:itemId/:quantity", updateQuantityValidator, IsAuthValidator.require, updateProductQuantityController);

router.post("/cart/details", IsAuthValidator.optional, getCartDetailsController); //Retrieve items in the cart for a specific user.

export default router;
