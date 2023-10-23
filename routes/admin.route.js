const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate.middleware');
const { renderAdminDashboard, renderReferrals } = require('../controllers/admin.controller')


const adminDepositRoute = require('./adminDeposit.route')
const adminWithdrawRoute = require('./adminWithdraw.route')
const adminReferralRoute = require('./adminRefer.route')
const adminUserRoute = require('./adminUser.route')
const adminProfileRoute = require('./adminPersonalProfile.route')
const adminBonusRoute = require('./addBonus.route')
const adminSuspendRoute = require('./adminSuspend.route')
const adminUnsuspendRoute = require('./adminUnsuspend.route')


router.use('/deposit', adminDepositRoute)
router.use('/withdraw', adminWithdrawRoute)
router.use('/referral', adminReferralRoute)
router.use('/user', adminUserRoute)
router.use('/profile', adminProfileRoute)
router.use('/bonus', adminBonusRoute)
router.use('/suspend', adminSuspendRoute)
router.use('/unsuspend', adminUnsuspendRoute)


router.get('/', renderAdminDashboard)

module.exports = router