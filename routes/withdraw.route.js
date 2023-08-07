const express = require('express');
const router = express.Router();
const fetchUserData = require('../middlewares/fetchUserData.middleware');
const { handleWithdrawal, renderWithdrawal } = require('../controllers/user.controller')


router.route('/')
    .get(fetchUserData, renderWithdrawal)
    .post(handleWithdrawal)


module.exports = router;