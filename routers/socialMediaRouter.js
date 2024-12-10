// external imports
const express = require("express");
const router = express.Router();


// internal router
const {authencitation} = require("../middlewares/common/authentication");

const {
    socialMediaUrlValidation,
    socialMediaUrlValidationHandler,
    updateSocialMediaUrlValidation,
    updateSocialMediaUrlValidationHandler
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
router.get("/",authencitation );

// add social media
router.post("/add",//need to verify url contains corret social media or not
    authencitation,
    socialMediaUrlValidation,
    socialMediaUrlValidationHandler,
    splitSubdirectories,
    addSocialmedia, 
);

// update social media
router.put("/update/:id",
    authencitation,
    updateSocialMediaUrlValidation,
    updateSocialMediaUrlValidationHandler,
    splitSubdirectories,
    updateSocialmedia
 );

// remove social media
router.delete("/remove/:id",
    authencitation,
    removeSocialmedia

);



module.exports = router;