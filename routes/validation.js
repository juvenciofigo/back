const express = require("express").Router();

router.use(function (err, req, res, next) {
    if (err.name == "ValidationError") {
        return res.status(422).json({
            errors: Object.keys(err.errors).reduce(function (errors, key) {
                errors[key] = err.errors[key.message];
                return errors;
            }, {}),
        });
    }
});

module.exports = router