const uploader = require("../../utils/multipleFileUploader");

function multipleImageUpload(req, res, next) {

  const upload = uploader(
    "profile-photo",
    "cover-photo",
    ["image/jpg", "image/jpeg", "image/png"],
    5000000,
    2,
    "Only .jpg, jpeg or .png format allowed!"
  );

  const fields = upload.fields([
    { name: 'profilePhoto', maxCount: 2 },
    { name: 'coverPhoto', maxCount: 2 }
  ]);

  // call the middleware function
  fields(req, res, (err) => {
    if (err) {
      res.status(500).json({
        errors: {
          photo: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });


}

module.exports = multipleImageUpload;
