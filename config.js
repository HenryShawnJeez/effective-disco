const PORT = process.env.PORT || 3000;
const cashFlipDuration =  180000 ; //15Hours 54000000
const basicDuration = 86400000; //24Hours
const standardDuration = 172800000; //48Hours
const essentialDuration = 259200000; //72Hours or 3Days
const proEssentialDuration = 432000000; //120 Hours or 5Days
const premiumDuration = 612000000; //170 Hours
const cashFlipPercent = 10;
const basicPercent = 0.2;
const standardPercent = 0.3;
const essentialPercent = 0.6;
const proEssentialPercent = 0.8;
const premiumPercent = 1;
const referralEarningPercent = 0.1;


module.exports = { PORT, cashFlipPercent, basicPercent, standardPercent, essentialPercent, proEssentialPercent, premiumPercent, referralEarningPercent, cashFlipDuration, basicDuration, standardDuration, essentialDuration, proEssentialDuration, premiumDuration, }