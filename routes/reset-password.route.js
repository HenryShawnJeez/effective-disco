const express = require('express');
const router = express.Router();

const { renderPasswordReset, handlePasswordReset } = require('../controllers/user.controller');

router.get('/:token', renderPasswordReset)
router.post('/:token', handlePasswordReset)

module.exports = router;