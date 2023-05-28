const currencyRespository = require('../../repository/daos/accounts/currencyDao')
const { convertRequest } = require('../../utils/utils')

class CurrencyService {
    constructor(){}

    async getListOfCurrencies() {
        const allCurrencies = await currencyRespository.leerInfo()
        const listOfCurrencies = []
        allCurrencies.forEach(it => listOfCurrencies.push(it.currency));
        return listOfCurrencies
    }

    async createNewCurrency(request) {
        const currency = convertRequest(request)
        return await currencyRespository.subirInfo({
            currency: currency.currency
        })
    }
}

const currencyService = new CurrencyService()

module.exports = currencyService