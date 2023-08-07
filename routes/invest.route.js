const express = require('express');
const router = express.Router();
const fetchUserData = require('../middlewares/fetchUserData.middleware');

const { handleInvestment, renderInvestment } = require('../controllers/user.controller')

router.get('/', renderInvestment)
// router.post('/', fetchUserData)

router.post('/', fetchUserData, handleInvestment)


module.exports = router;