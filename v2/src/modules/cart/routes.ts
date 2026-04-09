import { Router } from "express";
const router = Router();
import {
    IsAdminValidator,
    IsAuthValidator,
    updateQuantityValidator,
    removeItemValidator,
    addProductToCartValidator,

    getCartsController,
    addProductToCartController,
    updateProductQuantityController,
    removeProductToCartController,
    getCartDetailsController,
    getCartTotalController,
    fetchCartsValidator,
} from "./index.js";

// router.post("/cart", IsAuthValidator.require, createCartController);

router.post("/carts/item", IsAuthValidator.require, addProductToCartValidator, addProductToCartController);

router.delete("/carts/item/:itemId", IsAuthValidator.require, removeItemValidator, removeProductToCartController);

router.patch("/carts/item/:itemId/:quantity", updateQuantityValidator, IsAuthValidator.require, updateProductQuantityController);

router.post("/carts/details", IsAuthValidator.optional, getCartDetailsController);

router.post("/carts/total", IsAuthValidator.optional, getCartTotalController);

// Admin routes
router.get("/carts/admin", IsAuthValidator.require, IsAdminValidator, fetchCartsValidator, getCartsController);

export default router;
