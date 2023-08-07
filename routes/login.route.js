const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/user.controller')

router.route('/')
    .get(function (req, res) {

        let flash = req.flash('alert');

        if (!flash || flash.length < 1) {
            return res.render('login', { alert: null });
        } else {
            try {
                flash = JSON.parse(flash)
                return res.render('login', { alert: flash || null });

            } catch (error) {
                console.log(error)
                return res.render('login', { alert: null });
            }
        }

    })
    .post(loginUser)


module.exports = router;