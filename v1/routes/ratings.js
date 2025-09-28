const router = require("express").Router();
const RatingController = require("../controllers/RatingController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const ratingValidation = require("../controllers/validations/ratingValidation");

router.get("/ratings", ratingValidation.getAllRatings, RatingController.getAllRatings);
router.get("/rating/:id", ratingValidation.getBtId, RatingController.getRating);
router.post("/rating/:productId", auth.require, ratingValidation.Create, RatingController.createRating);

// router.put("/rating/", auth.require, AdminValidator, RatingController.updateRating);

//ADMIN

router.delete("/rating/:id/permanteDelete", auth.require, AdminValidator, ratingValidation.Delete, RatingController.PerpenteDelete);

router.patch("/rating/:RatingId/delete", auth.require, AdminValidator, ratingValidation.Delete, RatingController.deleteRating);

module.exports = router;
