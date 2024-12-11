const express = require('express');
const router = express.Router();
const { help1 } = require("../controllers/sub.controller");

router.get('/', function(req, res){
    res.render('contact');
});

router.post("/", help1)

module.exports = router;