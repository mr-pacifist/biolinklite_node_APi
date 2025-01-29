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

const limiter = require("../middlewares/common/limiter");

const { 
    getSingleProfile,
    getMultipleProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    changeTheme,
 } = require("../controllers/profileController");


 // get single profile by profile id
router.get("/:id",
    limiter,
    authencitation,
    getSingleProfile,
 );

 // get multiple profile by user id
router.get("/profile-list/:id",
    limiter,
    authencitation,
    getMultipleProfile,
 );


// Create profile
router.post("/create",
    authencitation,
    imageUploader,
    createProfileValidation, 
    createProfileValidationHandler,
    createProfile
);

// update profile
router.patch("/edit/:id",
    authencitation,
    multipleImageUpload,
    updateProfileValidation,
    updateProfileValidationHandler,
    updateProfile,  
);

// delete profile
router.delete("/delete/:id", 
    authencitation,
    deleteProfile,

);
// Change theme of profile
router.put("/edit-theme/:id",
    authencitation,
    changeThemeValidation,
    changeThemeValidationHandler,
    changeTheme
      
);


module.exports = router;