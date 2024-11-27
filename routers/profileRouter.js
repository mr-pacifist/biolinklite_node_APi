// external imports
const express = require("express");
const router = express.Router();

// internal imports
const { authencitation } = require("../middlewares/common/authencitation");

const {  
    profileValidation,
    profileValidationHandler
} = require("../middlewares/profile/profileValidator");

const imageUploader = require("../middlewares/profile/imageUploader");

const { 
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
 } = require("../controllers/profileController");


 // get user profile

router.get("/",authencitation );

// Create profile
router.post("/new-profile",
    authencitation,
    imageUploader,
    profileValidation,
    profileValidationHandler,
    createProfile
);

module.exports = router;