const { Schema, model } = require('mongoose');

const accountSchema = new Schema({
    method: String,
    amount: Number,
    accountNumber: String,
    SortCode: String,
    wallet: String,
    address: String,
    accountName: String,
    bankName: String,
})


const transactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ['withdrawal', 'deposit', 'investment', 'earning', 'referral earnings', "bonus"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    plan: {
        type: String
    },
    medium: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "successful", "failed"],
        default: "pending"
    },
    expiresAt: {
        type: Date,
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    transactionID: {
        type: String
    },
    securityNo: {
        type: String
    },
    isFulfilled :{
        type: Boolean,
        default: false,
    },
    account: {
        type: accountSchema,
        default: {}
    }

}, { timestamps: true });



const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;