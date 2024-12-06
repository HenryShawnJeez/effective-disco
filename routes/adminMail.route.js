const express = require('express');
const router = express.Router();
const { renderAdminEmail, sendEmail } = require('../controllers/admin.controller');
const upload = require("../middlewares/multer.middleware")

router.route('/')
      .get(renderAdminEmail)
      .post(upload.single("image"), sendEmail)

module.exports = router;