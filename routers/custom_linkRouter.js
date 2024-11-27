// external imports
const express = require("express");
const router = express.Router();

// internal imports

const {authencitation} = require("../middlewares/common/authencitation");

const {
    customLinkValidation,
    customLinkValidationHandler,
} = require("../middlewares/customLink/customLinkValidator");

const {
    getCustomLink,
    addCustomLink,
    updateCustomLink,
    removeCustomLink,

} = require("../controllers/custom_linkController");




router.get("/",authencitation, getCustomLink);

// add custom link
router.post("/add", 
    authencitation,
    customLinkValidation,
    customLinkValidationHandler,
    addCustomLink
);

// update custom link
router.put("/edit/:id", 
    authencitation,
    customLinkValidation,
    customLinkValidationHandler,
    updateCustomLink
);

// delete custom link
router.delete("/remove/:id", 
    authencitation,
    removeCustomLink   
);




module.exports = router;