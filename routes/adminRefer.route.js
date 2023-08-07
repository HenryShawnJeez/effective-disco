const express = require('express');
const router = express.Router();
const { renderReferrals } = require('../controllers/admin.controller');

router.get('/', renderReferrals);


module.exports = router;