// external imports
const express = require("express");
const router = express.Router();


// internal router
const { authorization } = require("../middlewares/common/authorization");

const {
    socialMediaUrlValidation,
    socialMediaUrlValidationHandler
} = require("../middlewares/socialMedia/socialMediaValidator");
// split the url's subdiretories
const splitSubdirectories = require("../utils/splitUrlSubdirectories");

// controllers
const {
    getSocialmedia,
    addSocialmedia,
    updateSocialmedia,
    removeSocialmedia
} = require("../controllers/socialMediaController");


// get social media
router.get("/",authorization );

// add social media
router.post("/add",
    authorization,
    socialMediaUrlValidation,
    socialMediaUrlValidationHandler,
    splitSubdirectories,
    addSocialmedia, 
);

// update social media
router.put("/update/:id",authorization );

// remove social media
router.delete("/remove/:id",authorization );



module.exports = router;