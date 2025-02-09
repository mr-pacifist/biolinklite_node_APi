// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const fs = require("fs");

// internal imports
const Prisma = require("../../prisma/prismaClient");

// Profile create validation
const createProfileValidation = [
    check("userId")
    .notEmpty()
    .withMessage("User ID is required!")
    .custom(async (value) => {
      try {
        const user = await Prisma.user.findUnique({
            where: {
              id: value,
            },
          })
        if (!user) {
          throw createError("Invalid user ID");
        }
      } catch (err) {
        throw createError(err.message);
      }
    })
    .trim().escape(),

    check("name")
        .notEmpty()
        .withMessage("Profile name is required")
        .isLength({ min:3},{max:20})
        .withMessage("Profile name must be 3 chars long")
        .trim(),

    check("bio")
        .optional()
        .isLength({ min:5},{max:50})
        .withMessage("Bio must be 10-50 chars long")
        .trim(),
      
    check("sub_directory")
        .notEmpty()
        .withMessage("Slug is required")
        .isLength({max:50})
        .withMessage("Slug is  too long")
        .customSanitizer(value => value.replace(/\s+/g, ''))
        .toLowerCase()
        .custom(async (value) => {
          try {
            const subDirectory = await Prisma.profile.findUnique({
              where: {
                sub_directory: value,
              },
              })
            if (subDirectory) {
              throw createError("This slug is not available");
            }
          } catch (err) {
            throw createError(err.message);
          }
        })
        .trim().escape(),
  ];

// profile inputs validation handle and error through
const createProfileValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
      next();
    } else {
      // remove uploaded files
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      fs.unlink(
        path.join(__dirname, `../../public/profile-photo/${filename}`),
        (err) => {
          if (err) return res.json({message:"unknown error occurred!"});
        }
      );
    }
    // response the errors
    res.status(401).json({
      errors: mappedErrors,
    });
     
    }
  };

// profile update validation
const updateProfileValidation = [
  check("userId")
  .notEmpty()
  .withMessage("User ID is required!")
  .custom(async (value) => {
    try {
      const user = await Prisma.user.findUnique({
          where: {
            id: value,
          },
        })
      if (!user) {
        throw createError("Invalid user ID");
      }
    } catch (err) {
      throw createError(err.message);
    }
  })
  .trim().escape(),

  check("name")
      .optional()
      .isLength({ min:3},{max:20})
      .withMessage("Profile name must be 3 chars long")
      .trim(),

  check("bio")
      .optional()
      .isLength({ min:5})
      .withMessage("Bio must be 5 or more chars long")
      .trim(),
    
  check("sub_directory")
      .optional()
      .isLength({min:3},{max:50})
      .withMessage("Slug must contain 3 - 50 chars long")
      .customSanitizer(value => value.replace(/\s+/g, ''))
      .toLowerCase()
      .custom(async (value, { req }) =>{
        try {
          const subDirectory = await Prisma.profile.findUnique({
            where: {
                sub_directory: value,
            },
            select: { id: true },
          });
          if (subDirectory && subDirectory.id !== req.params.id) {
            throw createError("This slug is not available");
          }
        } catch (err) {
          throw createError(err.message);
        }
      })
      .trim().escape(),
  check("seo_title")
      .optional()
      .isLength({ min:3},{max:255})
      .withMessage("Seo title must be 3 chars long")
      .trim(),
  check("seo_description")
      .optional()
      .isLength({ min:3},{max:255})
      .withMessage("Require 3 or more character ")
      .trim(),
];
// profile update validation handle and error through
const updateProfileValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {

    // remove uploaded files
  if (req.files) {

    let profile_Photo;
    let cover_Photo;

    if(req.files.profilePhoto){
      profile_Photo  = req.files.profilePhoto[0].filename;

    }

    if(req.files.coverPhoto){
       cover_Photo  = req.files.coverPhoto[0].filename;
    }
    
    if(profile_Photo){
      fs.unlink(
        path.join(__dirname, `../../public/profile-photo/${profile_Photo}`),
        (err) => {
          if (err) return res.status(500).json({message:"unknown error occurred!"});
        }
      );
    }
    if(cover_Photo){
      fs.unlink(
        path.join(__dirname, `../../public/cover-photo/${cover_Photo}`),
        (err) => {
          if (err) return res.status(500).json({message:"unknown error occurred!"});
        }
      );
    }
  }
  // response the errors
  res.status(401).json({
    errors: mappedErrors,
  });
   
  }
};


module.exports = {
    createProfileValidation,
    createProfileValidationHandler,
    updateProfileValidation,
    updateProfileValidationHandler
}