// external imports
const express = require("express");
const router = express.Router();

// internal imports

const {authorization} = require("../middlewares/common/authorization");

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




router.get("/",authorization, getCustomLink);

// add custom link
router.post("/add", 
    authorization,
    customLinkValidation,
    customLinkValidationHandler,
    addCustomLink
);

// update custom link
router.put("/edit/:id", 
    authorization,
    customLinkValidation,
    customLinkValidationHandler,
    updateCustomLink
);

// delete custom link
router.delete("/remove/:id", 
    authorization,
    removeCustomLink   
);




module.exports = router;