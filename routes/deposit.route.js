const express = require('express');
const { handleDeposit } = require('../controllers/user.controller');
const router = express.Router();
const fetchUserData = require('../middlewares/fetchUserData.middleware');
const renderDeposit = require("../controllers/user.controller");

router.get('/', fetchUserData, renderDeposit.renderDeposit);

router.post('/', fetchUserData, handleDeposit)


module.exports = router;