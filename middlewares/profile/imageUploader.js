const uploader = require("../../utils/singleFileUploader");

function imageUploader(req, res, next) {
  const upload = uploader(
    "profile-photo",
    ["image/jpg", "image/jpeg", "image/png"],
    2000000,
    "Only .jpg, jpeg or .png format allowed!"
  );

  // Call the middleware function
  upload.any()(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          photo: {
            msg: err.message,
          },
        },
      });
    } else {
      // Check if no file was uploaded
      if (!req.files || req.files.length === 0) {
        res.status(400).json({
          errors: {
            profilePhoto: {
              msg: "Profile photo is required!",
            },
          },
        });
         
      } else {
        next();
      }
    }
  });
}

module.exports = imageUploader;
