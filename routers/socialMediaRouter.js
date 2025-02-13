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

const limiter = require("../middlewares/common/limiter");

// controllers
const {
    getSocialmediaList,
    getProfileSocialmedia,
    addSocialmedia,
    updateSocialmedia,
    removeSocialmedia
} = require("../controllers/socialMediaController");


// get social media list
router.get("/list", limiter, authencitation, getSocialmediaList );

// get profile social media
router.get("/:id",authencitation, getProfileSocialmedia );

// add social media
router.post("/add",//need to verify url contains corret social media or not
    authencitation,
    socialMediaUrlValidation,
    socialMediaUrlValidationHandler,
    addSocialmedia, 
);

// update social media
router.put("/edit/:id",
    authencitation,
    updateSocialMediaUrlValidation,
    updateSocialMediaUrlValidationHandler,
    updateSocialmedia
 );

// remove social media
router.delete("/delete/:id",
    authencitation,
    removeSocialmedia

);

module.exports = router;