const express = require("express");
const router = express.Router();


const userRoute = require('./user.route')

//Importing routes
const aboutRoute = require("./about.route");
const contactRoute = require("./contact.route");
const faqRoute = require("./faq.route");
const servicesRoute = require("./service.route");
const indexRoute = require("./index.route");
const helpRoute = require("./help.route");
const policiesRoute = require("./policies.route");


// configuring routes

router.use("/user", userRoute)
router.use("/", indexRoute);
router.use("/index", indexRoute);
router.use("/aboutUs", aboutRoute);
router.use("/contact", contactRoute);
router.use("/faq", faqRoute);
router.use("/services", servicesRoute);
router.use('/support', helpRoute);
router.use("/policies", policiesRoute);



// exporting router middleware
module.exports = router;
