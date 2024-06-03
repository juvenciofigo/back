const router = require("express").Router();

// auth
const auth = require("./auth");
const AdminValidator = require("../controllers/validations/adminValidator");

// rating
const RatingController = require("../controllers/RatingController");
const ratingValidation = require("../controllers/validations/ratingValidation");

//payment
const PaymentController = require("../controllers/integracoes/integration");
const paymentValidation = require("../controllers/validations/paymentValidation");

// client
router.post("/mpesaPay",paymentValidation.C2B, PaymentController.mpesaPay);

router.get("/ratings", ratingValidation.getAllRatings, RatingController.getAllRatings);
router.get("/rating/:id", ratingValidation.getBtId, RatingController.getRating);
router.post("/rating/new", auth.require, ratingValidation.Create, RatingController.createRating);
// router.put("/rating/", auth.require, AdminValidator, RatingController.updateRating);


//ADMIN
router.delete("/rating/:id", auth.require, AdminValidator, ratingValidation.Delete, RatingController.deleteRating);

module.exports = router;
