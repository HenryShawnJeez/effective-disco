const Admin = require('../models/admin.model')



class AdminServices {


    async findOne(filter) {
        return await Admin.findOne(filter).populate('deposits withdrawals investments')
    }


    async findAll(filter) {
        return await Admin.findOne(filter).populate('deposits withdrawals investments')
    }


    async updateOne(filter, updateData) {
        return await Admin.findOneAndUpdate(filter, updateData, {
            new: true
        })
    }
}

module.exports = new AdminServices