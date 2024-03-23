const express = require("express").Router();

router.use(function (err, req, res, next) {
    if (err.name == "ValidationError") {
        return res.status(422).json({
            error: Object.keys(err.error).reduce(function (error, key) {
                error[key] = err.error[key.message];
                return error;
            }, {}),
        });
    }
});

module.exports = router;
