const express = require("express");
const router = express.Router();

//Importing routes
const notFoundRoute = require("./notfound.route");
const historyRoute = require("./history.route")
const {renderTransaction} = require('../controllers/user.controller');
const fetchUserData = require('../middlewares/fetchUserData.middleware')

// configuring routes
router.get("/",fetchUserData, renderTransaction);
router.use("/notfound", notFoundRoute);

// exporting router middleware
module.exports = router;