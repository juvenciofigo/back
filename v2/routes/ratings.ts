import { Router } from "express";
const router = Router();

import RatingController from "../controllers/RatingController.js";
import auth from "./auth.js";
import AdminValidator from "../controllers/validations/adminValidator.js";
import ratingValidation from "../controllers/validations/ratingValidation.js";

router.get("/ratings", ratingValidation.getAllRatings, RatingController.getAllRatings);
router.get("/rating/:id", ratingValidation.getBtId, RatingController.getRating);
router.post("/rating/:productId", auth.require, ratingValidation.Create, RatingController.createRating);

// router.put("/rating/", auth.require, AdminValidator, RatingController.updateRating);

//ADMIN

router.delete("/rating/:id/permanteDelete", auth.require, AdminValidator, ratingValidation.Delete, RatingController.PerpenteDelete);

router.patch("/rating/:RatingId/delete", auth.require, AdminValidator, ratingValidation.Delete, RatingController.deleteRating);

export default router;
