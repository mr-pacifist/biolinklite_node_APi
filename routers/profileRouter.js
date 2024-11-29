// external imports
const express = require("express");
const router = express.Router();

// internal imports
const { authencitation } = require("../middlewares/common/authencitation");

const { 
    createProfileValidation, 
    createProfileValidationHandler,
    updateProfileValidation,
    updateProfileValidationHandler
} = require("../middlewares/profile/profileValidator");

const imageUploader = require("../middlewares/profile/imageUploader");
const multipleImageUpload = require("../middlewares/profile/multipleImageUpload");

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
    createProfileValidation, 
    createProfileValidationHandler,
    createProfile
);

// update profile
router.put("/edit-profile/:id",
    authencitation,
    multipleImageUpload,
    updateProfileValidation,
    updateProfileValidationHandler,
    updateProfile,
    
);

module.exports = router;