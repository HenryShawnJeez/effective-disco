const userService = require("../services/user.service");
const transactionService = require("../services/transaction.service");
const { User } = require("../models/user.model");
const { referralEarningPercent } = require("../config");
const Email = require("../utils/mail.util");
const CronJob = require("cron").CronJob;
const payInvestors = require("../utils/payInvestors");
const { sendCustomEmail } = require("../utils/adminMail.util.js");

class AdminController {
  constructor() {
    new CronJob(
      "* * * * *",
      async function () {
        await payInvestors();
      },
      null,
      true,
      "America/Los_Angeles",
    );
  }
  //Render Admin Dashboard
  async renderAdminDashboard(req, res) {
    // fetching user data
    const transactions = await transactionService.findAll({});
    const users = await userService.findAll({});

    const deposits = transactions.filter(
      (transaction) =>
        transaction.type === "deposit" && transaction.status === "successful",
    );
    const lastDeposit = transactions
      .filter(
        (transaction) =>
          transaction.type === "deposit" && transaction.status === "successful",
      )
      .sort((a, b) => b.createdAt - a.createdAt)
      .shift();
    const withdrawals = transactions.filter(
      (transaction) =>
        transaction.type === "withdrawal" &&
        transaction.status === "successful",
    );
    const lastWithdrawal = transactions
      .filter(
        (transaction) =>
          transaction.type === "withdrawal" &&
          transaction.status === "successful",
      )
      .sort((a, b) => b.createdAt - a.createdAt)
      .shift();
    const investments = transactions.filter(
      (transaction) =>
        transaction.type === "investment" &&
        transaction.status === "successful",
    );
    const lastInvestment = transactions
      .filter(
        (transaction) =>
          transaction.type === "investment" &&
          transaction.status === "successful",
      )
      .sort((a, b) => b.createdAt - a.createdAt)
      .shift();
    const earnings = transactions.filter(
      (transaction) =>
        transaction.type === "earning" && transaction.status === "successful",
    );
    const lastEarning = transactions
      .filter(
        (transaction) =>
          transaction.type === "earning" && transaction.status === "successful",
      )
      .sort((a, b) => b.createdAt - a.createdAt)
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
      { status },
    );

    if (transaction.type === "deposit" && status === "successful") {
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
      }
      //Clients Notification
      status === "successful"
        ? new Email(
            transaction.user,
            ".",
            transaction.amount,
          ).sendDepositFinal()
        : new Email(
            transaction.user,
            ".",
            transaction.amount,
          ).sendDepositRejected();
      res.redirect("/user/admin/deposit");
    } else if (transaction.type === "withdrawal") {
      //Clients Notification
      status === "successful"
        ? new Email(
            transaction.user,
            ".",
            transaction.amount,
          ).sendWithdrawalFinal()
        : new Email(
            transaction.user,
            ".",
            transaction.amount,
          ).sendWithdrawalRejected();
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
    res.render("adminUser", { users });
  }
  //Render Admin Profile
  async renderAdminUsersProfile(req, res) {
    const user = await userService.findOne({ _id: req.params.user });
    const withdrawals = user.withdrawals;
    const deposits = user.deposits;
    const investments = user.investments;
    const earnings = user.earnings;
    const referrals = user.referrals;

    // Sort the arrays
    const sortArray = (array) =>
      array.sort((a, b) => b.createdAt - a.createdAt);

    res.render("adminPersonalProfile", {
      user,
      withdrawals: sortArray(withdrawals),
      deposits: sortArray(deposits),
      investments: sortArray(investments),
      earnings: sortArray(earnings),
      referrals: sortArray(referrals),
    });
  }
  //Render Admin Suspension
  async renderAdminSuspend(req, res) {
    const allUsers = await User.find({});
    const users = allUsers.filter((user) => user.isSuspended === false);
    res.render("adminSuspend", { users });
  }
  //Suspend User Function
  async suspendUser(req, res) {
    try {
      const userId = req.body.user;
      const user = await userService.findOne({ _id: userId });
      await User.findByIdAndUpdate(req.body.user, { isSuspended: true });
      req.flash("success", "Client was suspended successfully.");

      //Client Notification
      new Email(user).sendSuspended();
      res.redirect("/user/admin/suspend");
    } catch (error) {
      req.flash("error", "Sorry, couldn't suspend user, try again later.");
      res.redirect("/user/admin/suspend");
    }
  }
  //Render Admin Unsuspend Page
  async renderAdminUnsuspend(req, res) {
    const users = await User.find({});
    const suspendedUsers = users.filter((user) => user.isSuspended === true);
    res.render("adminUnsuspend", { suspendedUsers });
  }
  //Unsuspend User Function
  async unsuspendUser(req, res) {
    try {
      const userId = req.body.user;
      const user = await userService.findOne({ _id: userId });
      await User.findByIdAndUpdate(req.body.user, { isSuspended: false });
      req.flash(
        "success",
        "Client suspension status was changed successfully.",
      );
      //Client Notification
      new Email(user).sendUnsuspend();
      res.redirect("/user/admin/unsuspend");
    } catch (error) {
      req.flash("error", "Couldn't lift user suspension, try again later.");
      res.redirect("/user/admin/unsuspend");
    }
  }

  //Render Admin Email Page
  async renderAdminEmail(req, res) {
    const allUsers = await User.find({});
    const users = allUsers.filter((user) => user.role !== "admin");
    res.render("adminMail", { users });
  }

  //Send Email To Users
  async sendEmail(req, res) {
    try {
      const { selectAll, userIds, subject, title, message } = req.body;
      console.log(req.body)

      if (!userIds || !message){
        req.flash("error", "Kindly write a message, and also select some user(s).");
        res.redirect("/user/admin/mail");
        return;
      }
      let users;

      if (selectAll === "true") {
        // Fetch all users if "Select All" was ticked
        const allUsers = await User.find({});
        users = allUsers.filter((user) => user.role !== "admin");
      } else {
        // Fetch only selected users
        users = await User.find({
          _id: { $in: Array.isArray(userIds) ? userIds : [userIds] },
        });
      }

      for (const user of users) {
        await sendCustomEmail(user, subject, title, message);
      }

      req.flash("success", "Emails sent successfully!");
      res.redirect("/user/admin/mail");
    } catch (err) {

      req.flash("error", "An error occurred while sending emails.");
      res.redirect("/user/admin/mail");
    }
  }

  //Handle Bonus Function
  async handleBonus(req, res) {
    try {
      const user = await userService.findOne({ email: req.body.email });
      if (!user) {
        req.flash("error", "Couldn't fetch user details, try again later.");
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

      req.flash("success", "Bonus was added successfully.");
      res.redirect("/user/admin/bonus");
    } catch (error) {
      req.flash("error", "Couldn't add bonus to user, try again later.");
      res.redirect("/user/admin/bonus");
    }
  }
  //Delete User Function
  async deleteUser(req, res) {
    try {
      await User.findByIdAndDelete(req.body.user);
      req.flash("success", "User was deleted successfully.");
      res.redirect("/user/admin/user");
    } catch (error) {
      req.flash("error", "Couldn't delete user, try again later.");
      res.redirect("/user/admin/user");
    }
  }
}

module.exports = new AdminController();
