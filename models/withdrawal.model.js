const { Schema, model, default: mongoose } = require('mongoose');

const withdrawalSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
}, { timestamps: true })

const Withdrawal = model("Withdrawal", withdrawalSchema)
