const nodemailer = require('nodemailer');
const Email = process.env.EMAIL;
const EmailPassword = process.env.EMAIL_PASSWORD;
const From = process.env.FROM;
const AdminEmail = process.env.ADMIN_EMAIL;


class SubController {
    async help(req, res) {
        try {
            const { email, subject, message } = req.body;
            const transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: Email,
                    pass: EmailPassword,
                }
            });

            const mailOptions = {
                from: From,
                to: AdminEmail,
                subject: subject,
                text: `The Client With Email: ${email}\n\n is demanding for help from the users support page. His Message is: ${message}`,
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            req.flash('success', "Your petition was registered successfully. Support is on it's way.");
            res.redirect('/support');
        } catch (error) {
            req.flash('error', "Sorry, we couldn't request for support now, kindly try again later");
            res.redirect('/support');
        }


    }
    async help1(req, res) {
        try {
            const { email, subject, message } = req.body;
            const transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: Email,
                    pass: EmailPassword,
                }
            });

            const mailOptions = {
                from: From,
                to: AdminEmail,
                subject: subject,
                text: `The Client With Email: ${email}\n\n is demanding for help from the contact page. His Message is: ${message}`,
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            req.flash('success', "Your contact request was sent successfully. Kindly wait, an agent will get back to you soon.");
            res.redirect('/contact');
        } catch (error) {
            req.flash('error', "Sorry, we couldn't process your contact request now, kindly try again later.")
            res.redirect('/contact');
        }
    }
}

module.exports = new SubController()