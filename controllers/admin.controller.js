const AdminService = require("../services/admin.service");
const userService = require("../services/user.service");
const depositService = require("../services/deposit.service");
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

  async renderAdminDeposit(req, res) {
    const transactions = await transactionService.findAll({});
    const deposits = transactions.filter((transaction) => {
      return transaction.type === "deposit";
    });

    deposits.sort((a, b) => b.createdAt - a.createdAt);

    res.render("adminDeposit", { deposits });
  }

  async renderAdminWithdrawal(req, res) {
    const transactions = await transactionService.findAll({});
    const withdrawals = transactions.filter((transaction) => {
      return transaction.type === "withdrawal";
    });

    withdrawals.sort((a, b) => b.createdAt - a.createdAt);
    res.render("adminWithdraw", { withdrawals });
  }

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

      new Email(transaction.user).sendDeposit();
      res.redirect("/user/admin/deposit");
    } else if (transaction.type === "withdrawal") {
      new Email(transaction.user).sendWithdrawal();
      res.redirect("/user/admin/withdraw");
    }
  }

  async renderReferrals(req, res) {
    const users = await User.find({}).populate("referredBy");

    const referredUsers = users.filter((user) => user.referredBy);

    // res.send(referredUsers)

    res.render("adminRefer", { referredUsers });
  }

  async renderAdminUsers(req, res) {
    const users = await User.find({}).populate("referredBy");

    res.render("adminUser", { users, status: req.flash('status').join("") });
  }

  async renderAdminUsersProfile(req, res) {
    const user = await userService.findOne({ _id: req.params.user });
    res.render("adminPersonalProfile", { user });
  }
  async renderAdminSuspend(req, res) {
    const users = await User.find({}).populate("referredBy");
    res.render("adminSuspend", { users, status: req.flash("status").join("") });
  }
  async suspendUser(req, res) {
    try {
      await User.findByIdAndUpdate(req.body.user, { isSuspended: true })
      req.flash("status", "success");
      res.redirect('/user/admin/suspend')
    } catch (error) {
      req.flash("status", "fail");
      res.redirect('/user/admin/suspend')
    }
  }
  async renderAdminUnsuspend(req, res) {
    const users = await User.find({}).populate("referredBy");
    const suspendedUsers = users.filter((user) => 
      user.isSuspended === true
    )
    res.render("adminUnsuspend", { suspendedUsers, status: req.flash("status").join("") });
  }
  async unsuspendUser(req, res) {
    try {
      await User.findByIdAndUpdate(req.body.user, { isSuspended: false })
      req.flash("status", "success");
      res.redirect('/user/admin/suspend')
    } catch (error) {
      req.flash("status", "fail");
      res.redirect('/user/admin/suspend')
    }
  }
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
      } else if (transaction.type === "deposit") {
        user.deposits.push(transaction._id);
        new Email(user, "", req.body.amount).sendDeposit();
      }

      await user.save();

      req.flash("status", "success");
      res.redirect("/user/admin/bonus");
    } catch (error) {
      req.flash("status", "fail");
      res.redirect("/user/admin/bonus");
    }
  }
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
