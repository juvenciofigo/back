const router = require("express").Router();
const RatingController = require("../controllers/RatingController");
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");
const ratingValidation = require("../controllers/validations/ratingValidation");
const paymentController = require("../controllers/integracoes/integration");


router.post("/mpesaPay", paymentController.mpesaPay);
router.get("/ratings", ratingValidation.getAllRatings, RatingController.getAllRatings);
router.get("/rating/:id", ratingValidation.getBtId, RatingController.getRating);
router.post("/rating/new", auth.require, ratingValidation.Create, RatingController.createRating);

// router.put("/rating/", auth.require, AdminValidator, RatingController.updateRating);

//ADMIN

router.delete("/rating/:id", auth.require, AdminValidator, ratingValidation.Delete, RatingController.deleteRating);

module.exports = router;
