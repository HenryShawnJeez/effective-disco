const { Schema, model, default: mongoose } = require('mongoose');


const userSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    postalcode: {
        type: Number,
        default: ""
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"],
        default: "user"
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    referrals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    withdrawals: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    deposits: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    investments: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    earnings: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    passwordResetExpires: Date,
    passwordResetToken: String,

}, {
    timestamps: true, toObject: {
        virtual: true
    }, toJSON: {
        virtual: true
    },
});




userSchema.virtual("balance").get(function () {

    const withdrawals = this.withdrawals.filter(withdrawal => withdrawal.status === 'successful').reduce((total, current) => {
        return total + current.amount
    }, 0)
    const deposits = this.deposits.filter(deposit => deposit.status === 'successful').reduce((total, current) => {
        return total + current.amount
    }, 0)
    const investments = this.investments.filter(investment => investment.status === 'successful').reduce((total, current) => {
        return total + current.amount
    }, 0)
    const earnings = this.earnings.filter(earning => earning.status === 'successful').reduce((total, current) => {
        return total + current.amount
    }, 0)

    return (deposits + earnings) - (withdrawals + investments)
})


const User = model('User', userSchema);
module.exports = { User };

