const PORT = process.env.PORT || 3000;
const essentialDuration =  604800000 ; //7Days 54000000(3mins For testing)
const capitalDuration = 1209600000; //14Days
const advancedDuration = 1814400000; //21Days
const ultimateDuration = 2505600000; //29Days
const essentialPercent = 0.21; //21% 3% Daily for 7 Days
const capitalPercent = 0.70; //70% 5% Daily for 14 Days
const advancedPercent = 1.47; //147% 7% Daily for 21 Days
const ultimatePercent = 2.90; //290% 10% daily profit in 29 days
const referralEarningPercent = 0.05; //5%


module.exports = { PORT, essentialDuration, capitalDuration, advancedDuration, ultimateDuration, essentialPercent, capitalPercent, advancedPercent, ultimatePercent, referralEarningPercent }