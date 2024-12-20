// external imports
const express = require("express");
const router = express.Router();

// internal router
const {authencitation} = require("../middlewares/common/authentication");

const limiter = require("../middlewares/common/limiter");

const {headerValidation, headerValidationHandler} = require("../middlewares/header/headerValidator");

const {
    getHeaderTitle,
    addHeaderTitle,
    updateHeaderTitle,
    deleteHeaderTitle
} = require("../controllers/headerController");

// get header 
router.get("/:id", limiter, authencitation, getHeaderTitle);

// add header
router.post("/add",
    authencitation,
    headerValidation,
    headerValidationHandler, 
    addHeaderTitle
);
// update header
router.put("/edit/:id",
    authencitation,
    headerValidation,
    headerValidationHandler, 
    updateHeaderTitle
);
// delete header
router.delete("/delete/:id",
    authencitation,
    deleteHeaderTitle,
);

module.exports = router;