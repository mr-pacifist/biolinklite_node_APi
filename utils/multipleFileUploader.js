const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

function uploader(
  profile_subfolder_path,
  cover_subfolder_path,
  allowed_file_types,
  max_file_size,
  max_number_of_files,
  error_msg
) {
  // File upload folder
  const profile_Photo = path.join(__dirname, "../public", profile_subfolder_path);
  const cover_Photo = path.join(__dirname, "../public", cover_subfolder_path);

  // define the storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const destinationDir = file.fieldname === 'profilePhoto' ? profile_Photo : cover_Photo;
      cb(null, destinationDir);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      cb(null, fileName + fileExt);
    },
  });

  // prepare the final multer upload object
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
        
      if (req.files && req.files.length > max_number_of_files) {
        cb(
          createError(
            `Maximum ${max_number_of_files} files are allowed to upload!`
          )
        );
      } else {
        if (allowed_file_types.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(createError(error_msg));
        }
      }
    },
  });

  return upload;
}

module.exports = uploader;
