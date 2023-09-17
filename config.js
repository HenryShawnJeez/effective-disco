const PORT = process.env.PORT || 3000;
const essentialDuration =  259200000 ; //3days 54000000(For testing)
const capitalDuration = 432000000; //5days
const advancedDuration = 604800000; //7days
const ultimateDuration = 1209600000; //14Days
const essentialPercent = 0.15; //15%
const capitalPercent = 0.5; //50%
const advancedPercent = 1.4; //140%
const ultimatePercent = 5.6; //560%
const referralEarningPercent = 0.1; //10%


module.exports = { PORT, essentialDuration, capitalDuration, advancedDuration, ultimateDuration, essentialPercent, capitalPercent, advancedPercent, ultimatePercent, referralEarningPercent }