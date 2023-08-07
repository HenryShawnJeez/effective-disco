const express = require('express');
const router = express.Router();


const { renderAdminDeposit, handleApproval } = require('../controllers/admin.controller')



router.get('/', renderAdminDeposit);
router.patch('/', handleApproval)


module.exports = router;