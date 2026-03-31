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
} from "./index.js";

// router.post("/cart", IsAuthValidator.require, createCartController);

router.post("/item", IsAuthValidator.require, addProductToCartValidator, addProductToCartController);

router.delete("/item/:itemId", removeItemValidator, IsAuthValidator.require, removeProductToCartController);

router.patch("/item/:itemId/:quantity", updateQuantityValidator, IsAuthValidator.require, updateProductQuantityController);

router.post("/details", IsAuthValidator.optional, getCartDetailsController);

router.post("/total", IsAuthValidator.optional, getCartTotalController);

// Admin routes
router.get("/admin", IsAuthValidator.require, IsAdminValidator, getCartsController);

export default router;
