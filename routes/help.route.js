const express = require('express');
const router = express.Router();
const { help } = require("../controllers/sub.controller");

router.get('/', function(req, res){
    res.render('help', { status: req.flash('status').join("")});
});
router.post("/", help)

module.exports = router;