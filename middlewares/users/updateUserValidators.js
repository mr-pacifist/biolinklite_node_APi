// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");


// internal imports
const Prisma = require("../../prisma/prismaClient")

// user Data validation
const updateUserValidation = [
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

  check("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 10, max: 15 }) 
    .withMessage("Phone number is not in correct length")
    .matches(/^\+(?:[0-9] ?){6,14}[0-9]$/)
    .withMessage("Use '+' and number only")
    .trim(),

  check("email")
    .optional()
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email")
    .trim()
    .custom(async (value, {req}) => {
      try {
        const userEmail = await Prisma.user.findUnique({
            where: {
              email: value,
            },
            select: { id: true },
          })
        if (userEmail && userEmail.id !== req.params.id) {
          throw createError("Email already is use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    })
    .trim(),

check("city")
    .notEmpty()
    .withMessage("City name is required")
    .isLength({max: 50})
    .withMessage("City name is too large")
    .isAlpha()
    .withMessage("Use alphabet only")
    .toLowerCase()
    .trim(),

check("state")
    .notEmpty()
    .withMessage("State name is required")
    .isAlpha()
    .withMessage("Use alphabet only")
    .isLength({max: 50})
    .withMessage("State name is too large")
    .toLowerCase()
    .trim(),

check("postalCode")
    .notEmpty()
    .withMessage("Postal code is missing")
    .isLength({max: 15})
    .withMessage("Postal code is too large")
    .trim(),

check("country")
    .notEmpty()
    .withMessage("Country is missing")
    .isLength({max: 50})
    .withMessage("Country name is too large")
    .toLowerCase()
    .trim(),
];

// registration validator handler
const updateUserValidationHandler = function (req, res, next) {
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

module.exports= {
    updateUserValidation,
    updateUserValidationHandler,
};