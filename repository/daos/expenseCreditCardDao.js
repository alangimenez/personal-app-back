const { CrudMongo } = require('../crud/crud');
const expenseCreditCardModel = require('../../models/database/expenseCreditCardMg');
const creditCardSingleton = require('./creditCardDao');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class expenseCreditCardDao extends CrudMongo {
    constructor() {
        super(expenseCreditCardModel)
    }

    async getLastPeriodByCreditCardName (name) {
        try {
            const result = await this.model.find({name: name}, { __v: 0 }).sort({$natural:-1}).limit(1)
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async closePeriodByNameAndPeriod(creditCard) {
        try {
            const result = await this.model.updateOne({name: creditCard.name, period: creditCard.period}, {$set: {status: "CLOSE"}})
            return result
        } catch (e) {
            console.log(e)
        }
    }
}

let expenseCreditCardSingleton = new expenseCreditCardDao()

module.exports = expenseCreditCardSingleton