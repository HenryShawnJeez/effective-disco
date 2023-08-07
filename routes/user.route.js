const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate.middleware")
const authorize = require('../middlewares/authorize.middleware')


//Importing routes
const transactionRoute = require('./transaction.route');
const dashboardRoute = require("./dashboard.route");
const loginRoute = require("./login.route");
const forgotPasswordRoute = require("./forgot-password.route");
const registerRoute = require("./register.route");
const notFoundRoute = require("./notfound.route");
const depositRoute = require("./deposit.route")
const checkoutRoute = require("./checkout.route")
const investRoute = require("./invest.route");
const withdrawRoute = require("./withdraw.route")
const profileRoute = require("./profile.route");
const referralRoute = require("./referral.route");
const logoutRoute = require('./logout.route');
const adminRoute = require('./admin.route');
const resetPasswordRoute = require('./reset-password.route');





// configuring routes
router.use("/transactions", authenticate, transactionRoute)
router.use("/dashboard", authenticate, dashboardRoute);
router.use("/login", loginRoute);
router.use("/logout", logoutRoute);
router.use("/forgot-password", forgotPasswordRoute);
router.use("/reset-password", resetPasswordRoute);
router.use("/create", registerRoute);
router.use("/notfound", notFoundRoute);

router.use("/checkout", authenticate, checkoutRoute);
router.use("/invest", authenticate, investRoute);
router.use("/deposit", authenticate, depositRoute);
router.use("/withdraw", authenticate, withdrawRoute);
router.use("/profile", authenticate, profileRoute);
router.use("/referral", authenticate, referralRoute);


// ADMIN
router.use('/admin', authenticate, authorize('admin'), adminRoute)



// exporting router middleware
module.exports = router;