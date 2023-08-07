const nodemailer = require('nodemailer');
const ejs = require('ejs')
const { convert } = require('html-to-text')

class Email {

  constructor(user, link) {
    this.to = user.email
    this.name = user.name
    this.link = link
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
    const html = await ejs.renderFile(`${__dirname}/../views/emails/${template}.ejs`, { link: this.link, name: this.name })

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
    await this._send("welcome", "Welcome to Millennium investment")
  }
  async sendDeposit() {
    await this._send("deposit", "New Deposit")
  }
  async sendInvestment() {
    await this._send("investment", "New Investment")
  }
  async sendWithdrawal() {
    await this._send("withdrawal", "New Withdrawal")
  }
  async sendForgotPassword() {
    await this._send("forgotPassword", "Forgot Password")
  }


}



module.exports = Email