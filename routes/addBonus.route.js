const express = require('express');
const router = express.Router();
const { handleBonus } = require('../controllers/admin.controller')

router.get('/', function (req, res) {
    const [status] = req.flash('status')
    res.render('addBonus', { status });
});

router.post('/', handleBonus)


module.exports = router;