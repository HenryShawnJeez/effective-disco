const nodemailer = require("nodemailer");
const { convert } = require("html-to-text");
const ejs = require("ejs");


//Constants
const Email = process.env.EMAIL;
const EmailPassword = process.env.EMAIL_PASSWORD;
const From = process.env.FROM;
const AdminEmail = process.env.ADMIN_EMAIL;

function sendEmail(subject, text) {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: Email,
      pass: EmailPassword,
    },
  });

  const mailOptions = {
    from: From,
    to: AdminEmail,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

async function sendCustomEmail(user, subject, title, message) {

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: Email,
        pass: EmailPassword,
      },
    });

    const html = await ejs.renderFile(
      `${__dirname}/../views/emails/adminEmail.ejs`,
      {
        name: user.name,
        title,
        message,
        year: new Date().getFullYear(),
      },
    );

    const mailOptions = {
      from: From,
      to: user.email,
      subject: subject,
      html,
      text: convert(html),
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw to allow calling code to handle the error
  }
}

module.exports = { sendEmail, sendCustomEmail };
