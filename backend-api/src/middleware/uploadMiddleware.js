const multer = require("multer");
const { AppError } = require("../utils/errorHandlers");

const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new AppError("only jpg, jpeg and png supported.", 400));
    cb(null, true);
  },
});

module.exports = upload;
