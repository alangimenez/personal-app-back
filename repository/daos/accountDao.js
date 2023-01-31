const { CrudMongo } = require('../crud/crud');
const accountModel = require('../../models/database/accountMg.js');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class accountDao extends CrudMongo {
    constructor() {
        super(accountModel)
    }

    async updateBalance (account, amount) {
        try {
            const result = await this.model.updateOne({name: account}, {$set: {balance: amount}})
            return result;
        } catch (e) {
            console.log(e.message)
        }
    }

    async getAccountByName(name) {
        try {
            return await this.model.find({ name: name }, { __v: 0 });
        } catch (e) {
            console.log("can't read info by name")
            // return error.errorProcess("CRUD Error", `El Crud ha tenido un error -> ` + e.message);
        }
    }
}

let accountSingleton = new accountDao()

module.exports = accountSingleton