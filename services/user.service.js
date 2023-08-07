const { User } = require('../models/user.model');

class UserService {

    // general Crud Operations

    // create 
    async create(userData) {
        return await User.create(userData)
    }

    // update
    async update(filter, updateData) {
        return await User.findOneAndUpdate(filter, updateData);
    }

    // read 
    async findOne(filter) {
        return await User.findOne(filter).populate('referrals referredBy withdrawals deposits investments earnings')
    }

    async findAll(filter) {
        return await User.find(filter).populate('referrals referredBy withdrawals deposits investments earnings')
    }



}

module.exports = new UserService()