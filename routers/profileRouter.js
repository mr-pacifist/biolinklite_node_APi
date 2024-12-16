// external imports
const express = require("express");
const router = express.Router();

// internal imports
const { authencitation } = require("../middlewares/common/authentication");

const { 
    createProfileValidation, 
    createProfileValidationHandler,
    updateProfileValidation,
    updateProfileValidationHandler
} = require("../middlewares/profile/profileValidator");
const {
    changeThemeValidation,
    changeThemeValidationHandler,
} = require("../middlewares/profile/changeThemeValidator");

const imageUploader = require("../middlewares/profile/imageUploader");
const multipleImageUpload = require("../middlewares/profile/multipleImageUpload");

const { 
    getMultipleProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    changeTheme,
 } = require("../controllers/profileController");


 // get multiple profile by user id

router.get("/:id",
    authencitation,
    getMultipleProfile,
 );


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

// delete profile
router.delete("/delete-profile/:id", 
    authencitation,
    deleteProfile,

);
// Change theme of profile
router.put("/edit-profile-theme/:id",
    authencitation,
    changeThemeValidation,
    changeThemeValidationHandler,
    changeTheme
      
);

module.exports = router;