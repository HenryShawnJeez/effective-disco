const { Schema, model } = require('mongoose');



const adminSchema = new Schema({
    withdrawals: [{
        type: Schema.Types.ObjectId,
        ref: "Withdrawals",
        default: []
    }],
    deposits: [{
        type: Schema.Types.ObjectId,
        ref: "Deposits",
        default: []
    }],
    investments: [{
        type: Schema.Types.ObjectId,
        ref: "Investments",
        default: []
    }],
    pendings: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    users: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }]
});


const Admin = model('Admin', adminSchema)

module.exports = Admin