const express = require('express');
const router = express.Router();
const { renderAdminUsersProfile } = require('../controllers/admin.controller');

router.get('/:user', renderAdminUsersProfile);


module.exports = router;