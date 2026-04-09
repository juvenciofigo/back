import { Router } from "express";

import {
    IsAuthValidator,
    IsAdminValidator,

    // Validators
    createAddressValidator,
    updateAddressValidator,
    getAddressValidator,
    fetchAddressesValidator,

    // Controllers
    createAddressController,
    updateAddressController,
    getAddressController,
    fetchAddressesController,
    getAddressAdminController,
    fetchAddressesAdminController,
    deleteAddressController,
} from "./index.js";

const router = Router();

router.get("/addresses", fetchAddressesValidator, fetchAddressesController);

router.get("/address/:addressId", getAddressValidator, getAddressController);

router.post("/address", IsAuthValidator.require, createAddressValidator, createAddressController);

router.put("/address/:addressId", IsAuthValidator.require, updateAddressValidator, updateAddressController);

router.delete("/address/:addressId", IsAuthValidator.require, getAddressValidator, deleteAddressController);


router.get("/addresses-admin", IsAuthValidator.require, IsAdminValidator, fetchAddressesValidator, fetchAddressesAdminController);

router.get("/address-admin/:addressId", IsAuthValidator.require, IsAdminValidator, getAddressValidator, getAddressAdminController);

export default router;
