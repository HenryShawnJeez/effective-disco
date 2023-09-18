const nodemailer = require('nodemailer');

class SubController {
    async help(req, res) {
        try {
            const { email, subject, message } = req.body;
            const transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: "info@rehoniel.org",
                    pass: "Rehoniel123$",
                }
            });

            const mailOptions = {
                from: 'Rehoniel <info@rehoniel.org>',
                to: 'Rehoniel@proton.me',
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
            req.flash('status', 'success');
            res.redirect('/help');
        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/help')
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
                    user: "info@rehoniel.org",
                    pass: "Rehoniel123$",
                }
            });

            const mailOptions = {
                from: 'Rehoniel <info@rehoniel.org>',
                to: 'Rehoniel@proton.me',
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
            req.flash('status', 'success');
            res.redirect('/contact');
        } catch (error) {
            req.flash('status', 'fail')
            res.redirect('/contact')
        }


    }
}

module.exports = new SubController()