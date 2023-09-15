const userService = require("../services/user.service");
const transactionService = require("../services/transaction.service");
const { User } = require("../models/user.model");
const { referralEarningPercent } = require("../config");
const Email = require("../utils/mail.util");
const CronJob = require("cron").CronJob;
const payInvestors = require("../utils/payInvestors");

class AdminController {
  constructor() {
    const job = new CronJob(
      "* * * * *",
      async function () {
        await payInvestors()
      },
      null,
      true,
      "America/Los_Angeles"
    );
  }
//Render Admin Dashboard
  async renderAdminDashboard(req, res) {
    // fetching user data
    const transactions = await transactionService.findAll({});
    const users = await userService.findAll({});

    const deposits = transactions.filter((transaction) =>
      transaction.type === "deposit" && transaction.status === "successful"
    );
    const lastDeposit = transactions.filter((transaction) =>
      transaction.type === "deposit" && transaction.status === "successful"
    ).sort((a, b) => b.createdAt - a.createdAt)
      .shift();
    const withdrawals = transactions.filter((transaction) =>
      transaction.type === "withdrawal" && transaction.status === "successful"
    );
    const lastWithdrawal = transactions.filter((transaction) =>
      transaction.type === "withdrawal" && transaction.status === "successful"
    ).sort((a, b) => b.createdAt - a.createdAt)
      .shift();
    const investments = transactions.filter((transaction) =>
      transaction.type === "investment" && transaction.status === "successful"
    );
    const lastInvestment = transactions.filter((transaction) =>
      transaction.type === "investment" && transaction.status === "successful"
    ).sort((a, b) => b.createdAt - a.createdAt)
      .shift();
    const earnings = transactions.filter((transaction) =>
      transaction.type === "earning" && transaction.status === "successful"
    );
    const lastEarning = transactions.filter((transaction) =>
      transaction.type === "earning" && transaction.status === "successful"
    ).sort((a, b) => b.createdAt - a.createdAt)
      .shift();


    res.render("adminDashboard", {
      users,
      deposits,
      withdrawals,
      investments,
      earnings,
      transactions,
      lastDeposit,
      lastWithdrawal,
      lastInvestment,
      lastEarning,
    });
  }
//Render Admin Deposit
  async renderAdminDeposit(req, res) {
    const transactions = await transactionService.findAll({});
    const deposits = transactions.filter((transaction) => {
      return transaction.type === "deposit";
    });

    deposits.sort((a, b) => b.createdAt - a.createdAt);

    res.render("adminDeposit", { deposits });
  }
//Render Admin Withdrawal
  async renderAdminWithdrawal(req, res) {
    const transactions = await transactionService.findAll({});
    const withdrawals = transactions.filter((transaction) => {
      return transaction.type === "withdrawal";
    });

    withdrawals.sort((a, b) => b.createdAt - a.createdAt);
    res.render("adminWithdraw", { withdrawals });
  }
// Transaction Approval Function
  async handleApproval(req, res) {
    const { id, approve } = req.body;
    const status = approve === "confirm" ? "successful" : "failed";
    const transaction = await transactionService.update(
      { _id: id },
      { status }
    );

    if (transaction.type === "deposit") {
      // console.log("REF =>", transaction.user.referredBy)
      if (transaction.user.referredBy) {
        const referralEarnings = {
          from: transaction.user._id,
          user: transaction.user.referredBy,
          type: "referral earnings",
          status: "successful",
          amount: referralEarningPercent * transaction.amount,
        };

        const refEarnings = await transactionService.create(referralEarnings);
        await User.findByIdAndUpdate(transaction.user.referredBy, {
          $push: { earnings: refEarnings._id },
        });
        console.log("Upstream credited ");
      }
      //Clients Notification
      status === "successful" ? new Email(transaction.user, ".", transaction.amount).sendDepositFinal() : new Email(transaction.user, ".", transaction.amount).sendDepositRejected();
      res.redirect("/user/admin/deposit");
    } else if (transaction.type === "withdrawal") {
      //Clients Notification
      status === "successful" ? new Email(transaction.user, ".", transaction.amount).sendWithdrawalFinal() : new Email(transaction.user, ".", transaction.amount).sendWithdrawalRejected();
      res.redirect("/user/admin/withdraw");
    }
  }
//Render Referrals
  async renderReferrals(req, res) {
    const users = await User.find({}).populate("referredBy");

    const referredUsers = users.filter((user) => user.referredBy);

    res.render("adminRefer", { referredUsers });
  }
//Render Users
  async renderAdminUsers(req, res) {
    const users = await User.find({}).populate("referredBy");

    res.render("adminUser", { users, status: req.flash('status').join("") });
  }
//Render Admin Profile
  async renderAdminUsersProfile(req, res) {
    const user = await userService.findOne({ _id: req.params.user });
    res.render("adminPersonalProfile", { user });
  }
  //Render Admin Suspension
  async renderAdminSuspend(req, res) {
    const allUsers = await User.find({}).populate("referredBy");
    const users = allUsers.filter((user) => 
      user.isSuspended === false
    )
    res.render("adminSuspend", { users, status: req.flash("status").join("") });
  }
  //Suspend User Function
  async suspendUser(req, res) {
    try {
      const allUsers = await User.find({}).populate("referredBy");
      const userId = req.body.user
      const user = allUsers.find(user => user._id.equals(userId));
      await User.findByIdAndUpdate(req.body.user, { isSuspended: true })
      req.flash("status", "success");
      
      //Client Notification
      new Email(user).sendSuspended();
      res.redirect('/user/admin/suspend')
    } catch (error) {
      req.flash("status", "fail");
      res.redirect('/user/admin/suspend')
    }
  }
  //Render Admin Unsuspend Page
  async renderAdminUnsuspend(req, res) {
    const users = await User.find({}).populate("referredBy");
    const suspendedUsers = users.filter((user) => 
      user.isSuspended === true
    )
    res.render("adminUnsuspend", { suspendedUsers, status: req.flash("status").join("") });
  }
  //Unsuspend User Function
  async unsuspendUser(req, res) {
    try {
      const allUsers = await User.find({}).populate("referredBy");
      const userId = req.body.user
      const user = allUsers.find(user => user._id.equals(userId));
      await User.findByIdAndUpdate(req.body.user, { isSuspended: false })
      req.flash("status", "success");
      //Client Notification
      new Email(user).sendUnsuspend()
      res.redirect('/user/admin/unsuspend')
    } catch (error) {
      req.flash("status", "fail");
      res.redirect('/user/admin/unsuspend')
    }
  }
  //Handle Bonus Function
  async handleBonus(req, res) {
    try {
      const user = await userService.findOne({ email: req.body.email });
      if (!user) {
        req.flash("status", "fail");
        res.redirect("/user/admin/bonus");
        return;
      }

      const transactionData = {
        user: user._id,
        type: req.body.action,
        amount: req.body.amount,
        status: "successful",
      };

      const transaction = await transactionService.create(transactionData);

      if (transaction.type === "bonus") {
        user.earnings.push(transaction._id);
        new Email(user, ".", transaction.amount).sendBonus();
      } else if (transaction.type === "deposit") {
        user.deposits.push(transaction._id);
        new Email(user, ".", transaction.amount).sendDepositFinal();
      }

      await user.save();

      req.flash("status", "success");
      res.redirect("/user/admin/bonus");
    } catch (error) {
      req.flash("status", "fail");
      res.redirect("/user/admin/bonus");
    }
  }
  //Delete User Function
  async deleteUser(req, res) {
    try {
      await User.findByIdAndDelete(req.body.user)
      req.flash("status", "success");
      res.redirect('/user/admin/user')
    } catch (error) {
      req.flash("status", "fail");
      res.redirect('/user/admin/user')
    }
  }
}

module.exports = new AdminController();
