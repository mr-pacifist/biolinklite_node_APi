// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");


// internal imports
const Prisma = require("../../prisma/prismaClient")

// user Data validation
const registrationValidators = [
  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({min:3},{max:15})
    .withMessage("First name must contain 3-15 character")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Use alphabet only")
    .toLowerCase()
    .trim(),

  check("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({min:3},{max:15})
    .withMessage("Last name must contain 3-15 character")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Use alphabet only")
    .toLowerCase()
    .trim(),

  check("userName")
    .notEmpty()
    .withMessage("User name can't be empty")
    .isLength({min:5},{max:20})
    .withMessage("User name must contain 5-20 character")
    .isAlphanumeric()
    .withMessage("Use alphabet and number")
    .toLowerCase()
    .custom(async (value) => {
        try {
          const user = await Prisma.user.findUnique({
              where: {
                userName: value,
              },
            })
          if (user) {
            throw createError("Try with different user name");
          }
        } catch (err) {
          throw createError(err.message);
        }
      })
    .trim(),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .trim()
    .custom(async (value) => {
      try {
        const user = await Prisma.user.findUnique({
            where: {
              email: value,
            },
          })
        if (user) {
          throw createError("Email already is use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    })
    .trim(),

  check("password")
  .isLength({ min: 6 })
  .withMessage("Password must be 6 chars long")
];

// registration validator handler
const registrationValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // response the errors
    res.status(401).json({
      errors: mappedErrors,
    });
  }
};

// login validator
const loignValidators = [
  check("userName")
    .notEmpty()
    .withMessage("User name or email is required")
    .trim(),
    
  check("password")
   .isLength({ min: 6 })
   .withMessage("Password must be 6 chars long")

];
// login validation handler
const loignValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(401).json( {
      data: {
        userName: req.body.userName,
      },
      errors: mappedErrors,
    });
  }
};


module.exports = {
    registrationValidators,
    registrationValidationHandler,
    loignValidators,
    loignValidationHandler,
};