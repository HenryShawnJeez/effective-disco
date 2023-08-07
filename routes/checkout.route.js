const express = require('express');
const { handleCheckout } = require('../controllers/user.controller');
const fetchUserData = require('../middlewares/fetchUserData.middleware');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('checkout');
});

router.post('/', fetchUserData, handleCheckout)

module.exports = router;