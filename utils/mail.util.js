const nodemailer = require('nodemailer');
const ejs = require('ejs')
const { convert } = require('html-to-text')

class Email {

  constructor(user, link, amount) {
    this.to = user.email
    this.name = user.name
    this.link = link
    this.amount = amount
  }

  async _createTransporter() {
    return nodemailer.createTransport({

      host: "smtp.zoho.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "info@deluxecapital.org",
        pass: "Deluxecapital123$",
      }
    })
  }

  async _send(template, subject) {
    const html = await ejs.renderFile(`${__dirname}/../views/emails/${template}.ejs`, { link: this.link, name: this.name, amount: this.amount })

    const mailOptions = {
      from: 'Deluxe Capital <info@deluxecapital.org>', // sender address
      to: this.to,
      subject: subject,
      html,
      text: convert(html),
    }

    const transporter = await this._createTransporter()
    transporter.sendMail(mailOptions)
  }

  async sendWelcome() {
    await this._send("welcome", "Welcome to Deluxe Capital")
  }
  async sendDeposit() {
    await this._send("deposit", "New Deposit")
  }
  async sendDepositFinal() {
    await this._send("depositFinal", "Deposit Confirmed")
  }
  async sendInvestment() {
    await this._send("investment", "New Investment")
  }
  async sendWithdrawal() {
    await this._send("withdrawal", "New Withdrawal")
  }
  async sendWithdrawalFinal() {
    await this._send("withdrawFinal", "Withdrawal Confirmed")
  }
  async sendForgotPassword() {
    await this._send("forgotPassword", "Forgot Password")
  }
  async sendBonus() {
    await this._send("bonus", "New Bonus")
  }
  async sendSuspended() {
    await this._send("suspended", "Account Suspended")
  }
  async sendUnsuspend() {
    await this._send("unSuspend", "Account Reinstatement")
  }
  async sendDepositRejected() {
    await this._send("depositRejected", "Deposit Rejected")
  }
  async sendWithdrawalRejected() {
    await this._send("withdrawalRejected", "Withdrawal Rejected")
  }
  async sendPayout() {
    await this._send("payout", "New Earning")
  }
}



module.exports = Email