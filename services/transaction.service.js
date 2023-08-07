// const {User, Withdrawal, Deposit, Investment, Transaction} = require('../models/user.model')

const Transaction = require('../models/transaction.model');

class TransactionService {

    async create(transactionData) {
        return await Transaction.create(transactionData)
    }

    async findAll(filter) {
        return await Transaction.find(filter).populate("user")
    }

    async findOne(filter) {
        return await Transaction.findOne(filter).populate("user")
    }

    async delete(filter) {
        return await Transaction.findOneAndDelete(filter)
    }

    async update(filter, updateData) {
        return await Transaction.findOneAndUpdate(filter, updateData, { new: true }).populate('user')
    }

    async updateMany(filter, updateData) {
        return await Transaction.updateMany(filter, updateData)
    }
}

module.exports = new TransactionService()