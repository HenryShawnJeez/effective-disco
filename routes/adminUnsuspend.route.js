const express = require('express');
const router = express.Router();
const { renderAdminUnsuspend, unsuspendUser } = require('../controllers/admin.controller');

router.route('/')
      .get(renderAdminUnsuspend)
      .put(unsuspendUser)

module.exports = router;