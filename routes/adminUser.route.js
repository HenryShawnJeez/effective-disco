const express = require('express');
const router = express.Router();
const { renderAdminUsers, deleteUser } = require('../controllers/admin.controller');

router.route('/')
      .get(renderAdminUsers)
      .delete(deleteUser)

module.exports = router;