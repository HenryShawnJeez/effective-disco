const express = require('express');
const router = express.Router();
const { registerUser, renderRegisterPage } = require('../controllers/user.controller');




router.route('/')
    .get(renderRegisterPage)
    .post(registerUser)



module.exports = router;