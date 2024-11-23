// external imports
const express = require("express");
const router = express.Router();

// internal router
const {authorization} = require("../middlewares/common/authorization");
const {headerValidation, headerValidationHandler} = require("../middlewares/header/headerValidator");

const {
    getHeaderTitle,
    addHeaderTitle,
    updateHeaderTitle,
    deleteHeaderTitle
} = require("../controllers/headerController");

// get header 
router.get("/",);

// add header
router.post("/addHeader",
    authorization,
    headerValidation,
    headerValidationHandler, 
    addHeaderTitle
);
// update header
router.put("/updateHeader/:id",
    authorization,
    headerValidation,
    headerValidationHandler, 
    updateHeaderTitle
);
// delete header
router.delete("/removeHeader/:id",
    authorization,
    deleteHeaderTitle,
);


module.exports = router;