require('dotenv').config()
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const scheduler = require('node-schedule')
const saltRounds = 10;
const { cashFlipPercent, basicPercent, standardPercent, essentialPercent, proEssentialPercent, premiumPercent, referralEarningPercent, cashFlipDuration, basicDuration, standardDuration, essentialDuration, proEssentialDuration, premiumDuration, } = require('../config')
const nodemailer = require("nodemailer");
const userService = require('../services/user.service');
const AdminService = require('../services/admin.service')
const { generateUserId } = require('../utils/utils')
const transactionService = require('../services/transaction.service');
const { User, Investment } = require('../models/user.model');
const Email = require('../utils/mail.util')
const Transaction = require('../models/transaction.model')


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
            // throw an errow message saying user already exists
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

        // adding user to his uplines array
        if (referral) {
            referral.referrals.push(user._id);
            await referral.save()
        }

        const token = jwt.sign({
            _id: user._id,
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });


        new Email(user).sendWelcome()
        // Admin notification
        let transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true,
            auth: {
                user: "info@deluxecapital.org",
                pass: "Deluxecapital123$",
            },
        });

        let mailOptions = {
            from: 'Deluxe Capital <info@deluxecapital.org>',
            to: "Deluxecapital32@gmail.com",
            subject: "New User Notification",
            text: "Someone just signed up in your website, Deluxe capital, kindly check it out.",
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

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

        // Admin notification
        let transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true,
            auth: {
                user: "info@deluxecapital.org",
                pass: "Deluxecapital123$",
            },
        });

        let mailOptions = {
            from: 'Deluxe Capital <info@deluxecapital.org>',
            to: "Deluxecapital32@gmail.com",
            subject: "Login Notification",
            text: "Update!!! Someone just logged up in your website, Deluxe capital.",
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });

        res
            .cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
            .header('Authorization', token)
            .redirect('/user/dashboard')

    }

    async logoutUser(req, res) {
        res.clearCookie('token').redirect('/user/login')
    }

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


        return res.render('dashboard', { user: userInformation, deposits, withdrawals, investments, earnings, lastDeposit, lastWithdrawal, lastInvestment });
    }

    async renderProfile(req, res) {
        const userInformation = req.user;
        res.render('profile', { user: userInformation })
    }

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

    async renderReferral(req, res) {
        const userInformation = req.user;
        res.render('referral', { user: userInformation })
    }

    async renderTransaction(req, res) {
        const userInformation = req.user;

        const transactions = [...userInformation.withdrawals, ...userInformation.deposits, ...userInformation.earnings, ...userInformation.investments]

        transactions.sort((a, b) => b.createdAt - a.createdAt)


        res.render('history', { transactions })
    }

    async renderRegisterPage(req, res) {
        const { role, ref: referral } = req.query
        // if(!role) return console.log('user')
        res.render('create', { referral, role })
    }

    async handleWithdrawal(req, res) {
        try {
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
            // Admin notification
            let transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                port: 465,
                secure: true,
                auth: {
                    user: "info@deluxecapital.org",
                    pass: "Deluxecapital123$",
                },
            });

            let mailOptions = {
                from: 'Deluxe Capital <info@deluxecapital.org>',
                to: "Deluxecapital32@gmail.com",
                subject: "New Withdrawal Notification",
                text: "A client just withdrew from his account now, kindly log in to verify.",
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/withdraw')
        }
    }
    async renderWithdrawal(req, res) {
        const userInformation = req.user
        const withdrawals = userInformation.withdrawals.filter(withdrawal => withdrawal.status === "successful")
        res.render('withdraw', { user: req.user, status: req.flash('status').join(""), withdrawals });
    }
    async handleDeposit(req, res) {

        try {

            let wallet;

            switch (req.body.medium) {
                case "Bitcoin":
                    wallet = "bc1q92guvtfv77r6r8un6d7kvxuw3tmy5l293ajmu9";
                    break;
                case "Cardano":
                    wallet = "addr1q9a88rcffdcfv7m2tg4vvv33043ughw8aejy0pt6krw23prry8swej3yumhf6grwgzkrq70tzc3taq5r9almnethwtwqz7ln4n";
                    break;
                case "Ethereum":
                    wallet = "0xb44657E9CF77d0B1eBc66BfD5B1799297A8F52B4";
                    break;
                case "Bitcoin Cash":
                    wallet = "qz8ekm0mzd2cf3mamm9tq8puetftgx6xevw6v29zqu";
                    break;
                case "Solana":
                    wallet = "CETAcZ3S8SiYjbEjR8EmDGCcMwcaZT1LTCdpgKd4jLXx";
                    break;
                case "Litecoin":
                    wallet = "ltc1q66f9d9pg07ld2rwqj535t8424jevauas0susqk";
                    break;
                case "Usdt":
                    wallet = "TCY7rTpTMhnuBrrBErV3j95rbB48TALyqe";
                    break;
                case "usRazor":
                    wallet = "usRazor";
                    break;
                case "ukSteam":
                    wallet = "ukSteam";
                    break;
            }
            res.render('checkout', { amount: req.body.amount, medium: req.body.medium, wallet });

        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/deposit')
        }

    }
    async renderDeposit(req, res) {
        const userInformation = req.user
        const deposits = userInformation.deposits.filter(deposit => deposit.status === "successful")
        res.render('deposit', { status: req.flash('status').join(""), deposits });
    }
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
            // Admin notification
            let transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                port: 465,
                secure: true,
                auth: {
                    user: "info@deluxecapital.org",
                    pass: "Deluxecapital123$",
                },
            });

            let mailOptions = {
                from: 'Deluxe Capital <info@deluxecapital.org>',
                to: "Deluxecapital32@gmail.com",
                subject: "New Deposit Notification",
                text: "A client just deposited in your website, Deluxe capital, kindly log in to confirm",
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });

        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/checkout')
        }
    }

    async renderInvestment(req, res) {
        try {
            const investments = await User.findOne({ _id: req.user._id }).populate('investments').select('investments -_id')
            const activeInvestments = investments.investments.filter(investment => Date.now() < investment.expiresAt);

            res.render('invest', { investments: activeInvestments, status: req.flash('status').join("") })
        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/invest')
        }
    }

    async handleInvestment(req, res) {
        try {


            if (req.body.amount > req.user.balance) {
                return res.redirect('/user/deposit')
            }

            let payoutDuration;

            switch (req.body.plan) {
                case 'cashFlip': payoutDuration = cashFlipDuration; break;
                case 'basic': payoutDuration = basicDuration; break;
                case 'standard': payoutDuration = standardDuration; break;
                case 'essential': payoutDuration = essentialDuration; break;
                case 'proEssential': payoutDuration = proEssentialDuration; break;
                case 'premium': payoutDuration = premiumDuration; break;
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
                    case 'cashFlip':
                        amount = (transaction.amount + ((cashFlipPercent * transaction.amount))).toFixed(2);
                        break;
                    case 'basic':
                        amount = (transaction.amount + ((basicPercent * transaction.amount))).toFixed(2);
                        break;
                    case 'standard':
                        amount = (transaction.amount + ((standardPercent * transaction.amount))).toFixed(2);
                        break;
                    case 'essential':
                        amount = (transaction.amount + ((essentialPercent * transaction.amount))).toFixed(2);
                        break;
                    case 'proEssential':
                        amount = (transaction.amount + ((proEssentialPercent * transaction.amount))).toFixed(2);
                        break;
                    case 'premium':
                        amount = (transaction.amount + ((premiumPercent * transaction.amount))).toFixed(2);
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
            });

            new Email(user).sendInvestment()

            // Admin notification
            let transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                port: 465,
                secure: true,
                auth: {
                    user: "info@deluxecapital.org",
                    pass: "Deluxecapital123$",
                },
            });

            let mailOptions = {
                from: 'Deluxe Capital <info@deluxecapital.org>',
                to: "Deluxecapital32@gmail.com",
                subject: "New Investment Notification",
                text: "A client just started an investment your website, Deluxe capital.",
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });

            req.flash('status', 'success');
            res.redirect('/user/invest')


        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/user/invest')
        }
    }

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