const express = require('express');
const router = express.Router();
const { renderProfile, editUserProfile } = require("../controllers/user.controller");
const fetchUserData = require('../middlewares/fetchUserData.middleware')

router.get('/', fetchUserData, renderProfile);
router.patch('/', fetchUserData, editUserProfile);


module.exports = router;