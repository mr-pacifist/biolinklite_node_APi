const express = require("express");

const { authencitation } = require("../middlewares/common/authentication");

const { profileCounter } = require("../controllers/profileController");


const router = express.Router();


router.get("/:id",
    authencitation,
    profileCounter,
);

module.exports = router;