// external imports
const express = require("express");
const router = express.Router();

// internal router
const {authencitation} = require("../middlewares/common/authentication");

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
    authencitation,
    headerValidation,
    headerValidationHandler, 
    addHeaderTitle
);
// update header
router.put("/updateHeader/:id",
    authencitation,
    headerValidation,
    headerValidationHandler, 
    updateHeaderTitle
);
// delete header
router.delete("/removeHeader/:id",
    authencitation,
    deleteHeaderTitle,
);


module.exports = router;