const express = require('express');
const router = express.Router();



router.get('/', function(req, res){
    res.render('career');
});


module.exports = router;