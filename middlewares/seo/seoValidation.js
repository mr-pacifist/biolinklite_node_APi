// // external imports
// const { check, validationResult } = require("express-validator");


// // seo validator
// const seoValidation = [
//     check("title")
//         .notEmpty()
//         .withMessage("Title is required")
//         .isLength({ min:3},{max:20})
//         .withMessage("Title must be 3-20 chars long")
//         .toLowerCase()
//         .trim(),
      
//     check("description")
//         .notEmpty()
//         .withMessage("Description is required")
//         .isLength({max:255})
//         .withMessage("Description is too long")
//         .trim().escape(),
//   ];


// // custom link validation handler
// const seoValidationHandler = function (req, res, next) {
//     const errors = validationResult(req);
//     const mappedErrors = errors.mapped();
//     if (Object.keys(mappedErrors).length === 0) {
//       next();
//     } else {
//       res.status(401).json( {
//         errors: mappedErrors,
//       });
//     }
//   };

// module.exports = {
//     seoValidation,
//     seoValidationHandler,
// }