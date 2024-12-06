const multer = require("multer")
const path = require("path")


// Configure Multer for image uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads/"), // Save images in public/uploads
    filename: (req, file, cb) =>
      cb(null, Date.now() + path.extname(file.originalname)),
  }),
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimeType = fileTypes.test(file.mimetype);
    if (extname && mimeType) {
      return cb(null, true);
    }
    cb("Error: Images only!");
  },
});

module.exports = upload;
