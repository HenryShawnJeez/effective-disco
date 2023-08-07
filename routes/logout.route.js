const express = require('express');
const router = express.Router()

const { logoutUser } = require('../controllers/user.controller');

router.post('/', logoutUser)

module.exports = router