const { User, Withdrawal, Deposit, Investment } = require('../models/user.model')


class DepositService {

    // general Crud Operations

    // create 
    async create(deposit) {
        return await Deposit.create(deposit)
    }

    // update
    async update(filter, updateData) {
        return await Deposit.findOneAndUpdate(filter, updateData);
    }

    // read 
    async findOne(filter) {
        return await Deposit.findOne(filter)
    }

    async findAll(filter) {
        return await Deposit.find(filter)
    }



}

module.exports = new DepositService()