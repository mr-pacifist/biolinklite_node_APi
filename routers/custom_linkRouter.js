// external imports
const express = require("express");
const router = express.Router();

// internal imports

const {authencitation} = require("../middlewares/common/authentication");

const {
    customLinkValidation,
    customLinkValidationHandler,
} = require("../middlewares/customLink/customLinkValidator");

const limiter = require("../middlewares/common/limiter");

const {
    getCustomLink,
    addCustomLink,
    updateCustomLink,
    removeCustomLink,

} = require("../controllers/custom_linkController");

// get custom link by profile id

router.get("/:id",limiter,authencitation, getCustomLink);

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