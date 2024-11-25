// external imports
const express = require("express");
const router = express.Router();


// internal router
const { authorization } = require("../middlewares/common/authorization");

const {
    seoValidation,
    seoValidationHandler,
} = require("../middlewares/seo/seoValidation");

// controllers
const {
    getSeo,
    addSeo,
    updateSeo,
    removeSeo,
} = require("../controllers/seoController");


// get seo title and description
router.get("/",authorization, getSeo);

// add seo title and description
router.post("/add-seo",
    authorization,
    seoValidation,
    seoValidationHandler,
    addSeo, 
);

// update seo title and description by id
router.put("/update-seo/:id",
    authorization,
    seoValidation,
    seoValidationHandler,
    updateSeo, 
);

// remove seo title and description by id
router.delete("/remove-seo/:id",
    authorization,
    removeSeo
 );



module.exports = router;