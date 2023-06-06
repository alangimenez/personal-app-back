const { convertRequest } = require('../../utils/utils')
const otherQuotesDao = require('../../repository/daos/investments/otherQuotesDao')
const { addDays } = require('../../utils/utils')
const moment = require('moment'); // require
moment().format();
const fetch = require('node-fetch')

class OtherQuotesService {
    constructor() { }

    async uploadNewQuote(request) {
        const quote = convertRequest(request)

        let sleep = function (ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        };

        const response = await fetch('https://criptoya.com/api/dolar')
        const data = await response.json()

        const ethereumResponse = await fetch('https://api.coingecko.com/api/v3/coins/ethereum')
        const ethereumData = await ethereumResponse.json()

        const litecoinResponse = await fetch('https://api.coingecko.com/api/v3/coins/litecoin')
        const litecoinData = await litecoinResponse.json()

        const bitcoinResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin')
        const bitcoinData = await bitcoinResponse.json()

        await otherQuotesDao.subirInfo({
            date: quote.date,
            quotes: {
                dolarbnacomprador: data.oficial,
                dolarbnavendedor: data.oficial - 12,
                dolarmep: data.mep,
                ethereum: ethereumData.market_data.current_price.usd,
                bitcoint: bitcoinData.market_data.current_price.usd,
                litecoin: litecoinData.market_data.current_price.usd
            }
        })

        return ({ 'message': 'ok' })
    }

    async getLastQuote() {
        const lastQuote = await otherQuotesDao.getLastQuote()
        // const date = new Date(lastQuote[0].date)
        return ({
            ...lastQuote[0]._doc,
            "proxDate": addDays(lastQuote[0].date),
            "date": moment(lastQuote[0].date).add(12, 'hours').format('YYYY-MM-DD')
        })
    }

}

const otherQuotesService = new OtherQuotesService()

module.exports = otherQuotesService