const nodemailer = require('nodemailer');

function sendEmail(subject, text) {
    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
        user: "info@rehoniel.org",
        pass: "Rehoniel123$",
    },
    });

    const mailOptions = {
        from: 'Rehoniel <info@rehoniel.org>',
        to: "Rehoniel@proton.me",
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

module.exports = {  sendEmail };
