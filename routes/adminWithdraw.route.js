const express = require('express');
const router = express.Router();
const { renderAdminWithdrawal, handleApproval } = require('../controllers/admin.controller');

router.get('/', renderAdminWithdrawal)
    .patch('/', handleApproval)


module.exports = router;