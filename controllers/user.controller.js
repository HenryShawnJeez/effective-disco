require('dotenv').config()
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const scheduler = require('node-schedule')
const saltRounds = 10;
const { essentialDuration, capitalDuration, advancedDuration, ultimateDuration, essentialPercent, capitalPercent, advancedPercent, ultimatePercent} = require('../config')
const userService = require('../services/user.service');
const { generateUserId } = require('../utils/utils')
const transactionService = require('../services/transaction.service');
const { User} = require('../models/user.model');
const Email = require('../utils/mail.util')
const { sendEmail } =require('../utils/adminMail.util')


class UserController {

    // registering a user 
    async registerUser(req, res) {


        const userData = {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            secret: {
                question: req.body.secretQuestion,
                answer: req.body.secretAnswer
            },
            role: req.body.role || 'user',
            withdrawals: [],
            deposits: [],
            investments: [],
            earnings: []
        }

        // checking if referral exists 
        const referral = await userService.findOne({ userId: req.body.referredBy })
        if (referral) {
            userData.referredBy = referral._id;
        }

        // checking if user already exists
        const userAlreadyExists = await userService.findOne({ email: userData.email });
        if (userAlreadyExists) {
            // throw an error message saying user already exists
            req.flash('alert', JSON.stringify({ "message": "User already Exists, Please login in", "status": "info" }));
            res.redirect('/user/login')
            return;
        }


        // hashing users password
        const hash = await bcrypt.hash(userData.password, saltRounds);

        // saving it to their user data object
        userData.password = hash;
        userData.userId = generateUserId()

        const user = await userService.create(userData)

        // adding user to his referred clients array
        if (referral) {
            referral.referrals.push(user._id);
            await referral.save()
        }

        const token = jwt.sign({
            _id: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        //Client Notification
        new Email(user).sendWelcome()
         //Admin Notification
         const subject = "New User Notification";
         const text = `A new client of name: ${user.name} and Email: ${user.email} just signed up, Deluxe capital.${referral ? `The client was referred ${referral._id}` : ""}`

         sendEmail(subject, text)

        res
            .cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
            .header('Authorization', token)
            .redirect('/user/dashboard')

    }

    async loginUser(req, res) {

        const userCredentials = req.body;


        // check if user exists
        const foundUser = await userService.findOne({ email: userCredentials.email });
        if (!foundUser) {
            // throw an error with incorrect email or password
            req.flash('alert', JSON.stringify({ "message": "Invalid Username or Password", "status": "error" }));
            res.redirect('/user/login')
            console.error("user does not exist");
            return;
        }

        // comparing passwords
        const isCorrectPassword = await bcrypt.compare(userCredentials.password, foundUser.password);

        if (!isCorrectPassword) {
            // throw an error with incorrect email or password;
            req.flash('alert', JSON.stringify({ "message": "Invalid Username or Password", "status": "error" }));
            res.redirect('/user/login')
            console.error('incorrect email or password')
            return;
        }

        const token = jwt.sign({
            _id: foundUser._id,
            email: foundUser.email,
            role: foundUser.role
        }, process.env.JWT_SECRET_KEY);
        
        //Admin Notification
        const subject = "Login Notification";
        const text = `Update!!! The client of Name:${foundUser.name} and Email:${foundUser.email} just logged into your website.`;

        sendEmail(subject, text)

        res
            .cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
            .header('Authorization', token)
            .redirect('/user/dashboard')

    }
    //Log Out
    async logoutUser(req, res) {
        res.clearCookie('token').redirect('/user/login')
    }
    //Render Dashboard
    async renderDashboard(req, res) {
        const userInformation = req.user

        if (userInformation.role === 'admin') {
            return res.redirect('/user/admin')
        }

        const lastDeposit = userInformation.deposits
            .filter(deposit => deposit.status === "successful")
            .sort((a, b) => b.createdAt - a.createdAt)
            .shift();

        const deposits = userInformation.deposits.filter(deposit => deposit.status === "successful")
        const lastWithdrawal = userInformation.withdrawals
            .filter(withdrawal => withdrawal.status === "successful")
            .sort((a, b) => b.createdAt - a.createdAt)
            .shift();

        const withdrawals = userInformation.withdrawals.filter(withdrawal => withdrawal.status === "successful")
        const lastInvestment = userInformation.investments
            .filter(investment => investment.status === "successful")
            .sort((a, b) => b.createdAt - a.createdAt)
            .shift();

        const investments = userInformation.investments.filter(investment => investment.status === "successful")
        const earnings = userInformation.earnings.filter(earning => earning.status === "successful")

        return res.render(userInformation.isSuspended ? "suspend": 'dashboard', { user: userInformation, deposits, withdrawals, investments, earnings, lastDeposit, lastWithdrawal, lastInvestment });
    }
    //User Profile
    async renderProfile(req, res) {
        const userInformation = req.user;
        res.render(userInformation.isSuspended ? "suspend": 'profile', { user: userInformation })
    }
    //Edit User Profile
    async editUserProfile(req, res) {


        const updateData = {
            name: req.body.name || req.user.name,
            email: req.body.email || req.user.email,
            username: req.body.username || req.user.username,
            country: req.body.country || req.user.country,
            postalcode: req.body.postalcode || req.user.postalcode,
            city: req.body.city || req.user.city,
            gender: req.body.gender || req.user.gender

        }

        if (req.body.password) {
            try {
                const hash = await bcrypt.hash(req.body.password, saltRounds);
                updateData.password = hash

            } catch (error) {
                console.error(error)
            }
        }

        await userService.update({ _id: req.user.id }, updateData);

        res.redirect('/user/profile')

    }
    //Render Referral
    async renderReferral(req, res) {
        const userInformation = req.user;
        res.render(userInformation.isSuspended ? "suspend": 'referral', { user: userInformation })
    }
    //Render History Page
    async renderTransaction(req, res) {
        const userInformation = req.user;

        const transactions = [...userInformation.withdrawals, ...userInformation.deposits, ...userInformation.earnings, ...userInformation.investments]

        transactions.sort((a, b) => b.createdAt - a.createdAt)


        res.render(userInformation.isSuspended ? "suspend": 'history', { transactions })
    }
    //Render Registration Page
    async renderRegisterPage(req, res) {
        const { role, ref: referral } = req.query
        res.render('create', { referral, role })
    }
    //Withdrawal Function
    async handleWithdrawal(req, res) {
        try {
            const userInformation = await userService.findOne({ _id: req.user._id })
                if (req.body.amount > userInformation.balance) {
                  req.flash('status', 'spam');
                  res.redirect('/user/withdraw');
                return;
              }

            const transactionData = {
                user: req.user._id,
                type: 'withdrawal',
                amount: req.body.amount,
            }
            if (req.body.medium === 'crypto') {
                transactionData.account = {
                    method: req.body.medium,
                    amount: req.body.amount,
                    wallet: req.body.wallet,
                    address: req.body.address,

                }
            } else if (req.body.medium === 'bank') {
                transactionData.account = {
                    method: req.body.medium,
                    amount: req.body.amount,
                    accountNumber: req.body.accountNumber,
                    SortCode: req.body.sortCode,
                    accountName: req.body.accountName,
                    bankName: req.body.bankName,
                }
            }

            const withdrawal = await transactionService.create(transactionData);
            const user = await userService.findOne({ _id: req.user._id })
            user.withdrawals.push(withdrawal._id)
            await user.save()


            req.flash('status', 'success');
            res.redirect('/user/withdraw')
            
            // Client Notification
            new Email(user, ".", withdrawal.amount).sendWithdrawal()
            //Admin Notification
            const subject = "New Withdrawal Notification";
            const text = `The client of name: ${user.name} and email ${user.email} just withdrew amount: £${withdrawal.amount} from his account now, kindly log in to confirm the withdrawal.`;

            sendEmail(subject, text)
            
        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/withdraw')
        }
    }
    //Render Withdrawal
    async renderWithdrawal(req, res) {
        const userInformation = req.user
        const withdrawals = userInformation.withdrawals.filter(withdrawal => withdrawal.status === "successful" || withdrawal.status === "pending" || withdrawal.status === "failed");
        res.render(userInformation.isSuspended ? "suspend": 'withdraw', { user: req.user, status: req.flash('status').join(""), withdrawals });
    }
    //Deposit Function
    async handleDeposit(req, res) {

        try {

            let wallet;

            switch (req.body.medium) {
                case "Bitcoin":
                    wallet = "bc1q7w4cfq7vws00x30edzcwxuvn2pzdg7rvajsyku";
                    break;
                case "Ethereum":
                    wallet = "0xEc539Bfe99E0Cb4759bcC898A40C55B5F8a4e924";
                    break;
                case "Usdt":
                    wallet = "0xEc539Bfe99E0Cb4759bcC898A40C55B5F8a4e924";
                    break;
            }
            res.render('checkout', { amount: req.body.amount, medium: req.body.medium, wallet });

        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/deposit')
        }

    }
    //Render Deposit Page
    async renderDeposit(req, res) {
        const userInformation = req.user
        const deposits = userInformation.deposits.filter(deposit => deposit.status === "successful" || deposit.status === "pending" || deposit.status === "failed");
        res.render(userInformation.isSuspended ? "suspend": 'deposit', { user: req.user, status: req.flash('status').join(""), deposits });
    }
    //Checkout Function
    async handleCheckout(req, res) {
        try {

            if (req.body.action === 'cancel') {
                return res.redirect('/user/dashboard')
            }

            const transactionData = {
                user: req.user._id,
                type: 'deposit',
                amount: req.body.amount,
                medium: req.body.medium,
                transactionID: req.body.transactionID,
                securityNo: req.body.securityNo
            }

            const deposit = await transactionService.create(transactionData)
            const user = await userService.findOne({ _id: req.user._id })
            user.deposits.push(deposit._id)
            await user.save()


            req.flash('status', 'success')
            res.redirect('/user/deposit')

            // Client Notification
            new Email(user, ".", deposit.amount).sendDeposit()
            //Admin Notification
            const subject = "New Deposit Notification";
            const text = `The client ${user.name} and email ${user.email} just deposited £${deposit.amount} in your website, kindly log in to confirm.`;

            sendEmail(subject, text)
            

        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/checkout')
        }
    }
    //Render Investment
    async renderInvestment(req, res) {
        try {
            const investments = await User.findOne({ _id: req.user._id }).populate('investments').select('investments -_id')
            const activeInvestments = investments.investments.filter(investment => Date.now() < investment.expiresAt);
            console.log(activeInvestments)
            res.render('invest', { investments: activeInvestments, status: req.flash('status').join("") })
        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/invest')
        }
    }
    //Investment Function
    async handleInvestment(req, res) {
        try {
            if (req.body.amount > req.user.balance) {
                return res.redirect('/user/deposit');  
            }

            let payoutDuration;

            switch (req.body.plan) {
                case 'essential': payoutDuration = essentialDuration; break;
                case 'capital': payoutDuration = capitalDuration; break;
                case 'advanced': payoutDuration = advancedDuration; break;
                case 'ultimate': payoutDuration = ultimateDuration; break;
            }

            const transactionData = {
                user: req.user._id,
                type: 'investment',
                amount: req.body.amount,
                status: "successful",
                plan: req.body.plan,
                active: true,
                expiresAt: Date.now() + payoutDuration,
            }


            const investment = await transactionService.create(transactionData);
            const user = await userService.findOne({ _id: req.user._id })
            user.investments.push(investment._id)
            await user.save()


            const payoutDate = new Date(investment.expiresAt)

            // Schedule user's  investment
            const job = scheduler.scheduleJob(payoutDate, async function () {


                const transaction = await transactionService.update({ _id: investment._id }, { active: false, isFulfilled: true });

                let amount;


                switch (transaction.plan) {
                    case 'essential':
                        amount = (transaction.amount + ((essentialPercent * transaction.amount))).toFixed(2);
                        break;
                    case 'capital':
                        amount = (transaction.amount + ((capitalPercent * transaction.amount))).toFixed(2);
                        break;
                    case 'advanced':
                        amount = (transaction.amount + ((advancedPercent * transaction.amount))).toFixed(2);
                        break;
                    case 'ultimate':
                        amount = (transaction.amount + ((ultimatePercent * transaction.amount))).toFixed(2);
                        break;
                    default:
                        amount = 0;
                        break;
                }


                const earningData = {
                    user: transaction.user._id,
                    type: 'earning',
                    amount,
                    status: 'successful',
                    plan: transaction.plan
                }


                const earning = await transactionService.create(earningData)

                const user = await userService.findOne({ _id: earning.user._id });
                user.earnings.push(earning._id)
                await user.save()
                //Client Notification
                new Email(user, ".", earningData.amount).sendPayout();
            });

            //Client Notification
            new Email(user, transactionData.plan, transactionData.amount).sendInvestment()
           
            //Admin Notification
            const subject = "New Investment Notification";
            const text =  `The client of name: ${user.name} and email: ${user.email} just started the ${transactionData.plan}  plan with the amount £${transactionData.amount} in your website.`;

            sendEmail(subject, text)

            req.flash('status', 'success');
            res.redirect('/user/invest')


        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/invest')
        }
    }

    //Forgot Password Function
    async handleForgotPassword(req, res) {

        const user = await userService.findOne({ email: req.body.email });
        if (!user) {
            req.flash('status', 'fail')
            return res.redirect('/user/forgot-password')
        }

        try {
            const token = crypto.randomBytes(20).toString('hex');
            user.passwordResetToken = token;
            user.passwordResetExpires = Date.now() + 1000 * 60 * 10;
            await user?.save();


            const link = `${req.protocol}://${req.get('host')}/user/reset-password/${token}`;

            //Client Notification for Email reset
            new Email(user, link).sendForgotPassword()

        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save()
            req.flash('status', 'fail')
            res.redirect('/user/forgot-password')
            return
        }
        req.flash('status', 'success')
        res.redirect('/user/forgot-password')

    }

    //Password Reset Function
    async handlePasswordReset(req, res) {
        try {

            const user = await userService.findOne({
                $and: [{ passwordResetToken: req.body.resetToken }, { passwordResetExpires: { $gte: Date.now() } }]
            })
            if (!user) {
                req.flash('status', 'fail')
                return res.redirect('/user/forgot-password')
            }

            const hash = await bcrypt.hash(req.body.password, saltRounds)
            user.password = hash;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            const token = jwt.sign({
                _id: user._id,
                email: user.email,
                role: user.role
            }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

            cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
            req.flash('status', 'success')
            res
                .cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
                .redirect('/user/dashboard')

        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/dashboard')
        }
    }
    //Render Password Reset Page
    async renderPasswordReset(req, res) {

        try {
            res.render('resetPassword', { resetToken: req.params.token })
        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/dashboard')
        }
    }




}



module.exports = new UserController()