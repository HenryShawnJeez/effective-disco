const express = require('express');
const router = express.Router();
const { renderAdminUsers } = require('../controllers/admin.controller');

router.get('/', renderAdminUsers);


module.exports = router;