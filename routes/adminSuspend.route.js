const express = require('express');
const router = express.Router();
const { renderAdminSuspend, suspendUser } = require('../controllers/admin.controller');

router.route('/')
      .get(renderAdminSuspend)
      .put(suspendUser)

module.exports = router;