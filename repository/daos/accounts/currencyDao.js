const { CrudMongo } = require('../../crud/crud');
const currencyModel = require('../../../models/database/accounts/currencyMg');

class CurrencyDao extends CrudMongo {
    constructor() {
        super(currencyModel)
    }
}

let currencySingleton = new CurrencyDao()

module.exports = currencySingleton