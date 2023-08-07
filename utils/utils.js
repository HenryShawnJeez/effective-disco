const referralCodes = require('referral-codes')

class Util {

    generateUserId() {
        const result = referralCodes.generate({
            length: 6,
            count: 1
        })

        return result[0]
    }

}

module.exports = new Util()