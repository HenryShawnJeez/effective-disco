const nodemailer = require('nodemailer');

function sendEmail(subject, text) {
    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
        user: "info@deluxecapital.org",
        pass: "Deluxecapital123$",
    },
    });

    const mailOptions = {
        from: 'Deluxe Capital <info@deluxecapital.org>',
        // to: "Deluxecapital32@gmail.com",
        to: "Charleschukwuemeka47@outlook.com",
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
