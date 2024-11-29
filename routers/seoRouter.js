// // external imports
// const express = require("express");
// const router = express.Router();


// // internal router
// const {authencitation} = require("../middlewares/common/authencitation");

// const {
//     seoValidation,
//     seoValidationHandler,
// } = require("../middlewares/seo/seoValidation");

// // controllers
// const {
//     getSeo,
//     addSeo,
//     updateSeo,
//     removeSeo,
// } = require("../controllers/seoController");


// // get seo title and description
// router.get("/",authencitation, getSeo);

// // add seo title and description
// router.post("/add-seo",
//     authencitation,
//     seoValidation,
//     seoValidationHandler,
//     addSeo, 
// );

// // update seo title and description by id
// router.put("/update-seo/:id",
//     authencitation,
//     seoValidation,
//     seoValidationHandler,
//     updateSeo, 
// );

// // remove seo title and description by id
// router.delete("/remove-seo/:id",
//     authencitation,
//     removeSeo
//  );



// module.exports = router;