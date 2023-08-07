const fs = require('fs');




console.log(__dirname)

let welcomeMessage = fs.readFileSync(`${__dirname}/../messageTemplates/welcome.html`)
let resetPasswordMessage = fs.readFileSync(`${__dirname}/../messageTemplates/forgotPassword.html`)
let withdrawMessage = fs.readFileSync(`${__dirname}/../messageTemplates/withdrawal.html`)
let depositMessage = fs.readFileSync(`${__dirname}/../messageTemplates/deposit.html`)
let investmentMessage = fs.readFileSync(`${__dirname}/../messageTemplates/investment.html`)

class Message {



    generateMessage(type, options) {
        switch (type) {
            case 'welcome':
                return welcomeMessage
            case 'resetPassword':
                return resetPasswordMessage.toString().replace('{RESET_LINK}', options.link)
            case 'withdraw':
                return withdrawMessage
            case 'deposit':
                return depositMessage
            case 'investment':
                return investmentMessage
            default:
                return 'No message found'
        }
    }
}

const message = new Message()
module.exports = message
