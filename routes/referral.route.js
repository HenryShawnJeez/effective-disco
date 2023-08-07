const express = require('express');
const router = express.Router();

const { renderReferral } = require('../controllers/user.controller');
const fetchUserData = require('../middlewares/fetchUserData.middleware')

router.get('/', fetchUserData, renderReferral);



module.exports = router;