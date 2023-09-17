const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const userService = require('../services/user.service')
const transactionService = require('../services/transaction.service')
const Email = require("../utils/mail.util");
const { essentialPercent, capitalPercent, advancedPercent, ultimatePercent, referralEarningPercent } = require('../config')


const _getPayoutAmount = (plan, amount) =>{

    switch (plan) {
        case 'essential':
           return (amount + ((essentialPercent * amount))).toFixed(2);
            break;
        case 'capital':
           return (amount + ((capitalPercent * amount))).toFixed(2);
            break;
        case 'advanced':
           return (amount + ((advancedPercent * amount))).toFixed(2);
            break;
        case 'ultimate':
           return (amount + ((ultimatePercent * amount))).toFixed(2);
            break;
        default:
           return 0;
            break;
    }
}

 const payInvestors = async ()=>{
try {
// fetch all investments where there status is active and have not been fulfilled 
const pendingInvestments = await Transaction.find({$and : [{type: 'investment'}, {isFulfilled: {$ne : true}}, {expiresAt: {$lte : Date.now()}}]})

// console.log("pending", pendingInvestments)


        pendingInvestments.forEach(async investment => {


            const amount = _getPayoutAmount(investment.plan, investment.amount)


            const earningData = {
                user: investment.user._id,
                type: 'earning',
                amount,
                status: 'successful',
                plan: investment.plan
            }


            
            const earning = await transactionService.create(earningData)

            const user = await userService.findOne({ _id: earning.user._id });
            user.earnings.push(earning._id)
            await user.save()

            investment.isFulfilled = true
            investment.active = false

            await investment.save()
            new Email(user, ".", earningData.amount).sendPayout();

        })
        console.log(`Investors last paid at ${(new Intl.DateTimeFormat('en-US', {dateStyle: 'full', timeStyle: 'long'}).format(Date.now()))}`)


    } catch (error) {
        console.error(error)
    } 
}


module.exports = payInvestors