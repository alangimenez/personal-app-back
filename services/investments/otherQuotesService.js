const { convertRequest } = require('../../utils/utils')
const otherQuotesDao = require('../../repository/daos/investments/otherQuotesDao')
const { addDays } = require('../../utils/utils')
const moment = require('moment'); // require
moment().format();
const fetch = require('node-fetch')

class OtherQuotesService {
    constructor() { }

    async uploadNewQuote() {
        const lastQuote = await otherQuotesDao.getLastQuote()
        const lastQuotesDate = lastQuote[0].date
        const dateForCriptoFetch = moment(lastQuotesDate).add(60, 'hours').format('DD-MM-YYYY')

        const dollarData = await this.#getDollarData()
        const ethereumData = await this.#getEthereumData(dateForCriptoFetch)
        const litecoinData = await this.#getLitecoinData(dateForCriptoFetch)
        const bitcoinData = await this.#getBitcoinData(dateForCriptoFetch)

        await otherQuotesDao.subirInfo({
            date: moment(lastQuotesDate).add(24, 'hours').toDate(),
            quotes: {
                dolarbnacomprador: dollarData.oficial,
                dolarbnavendedor: dollarData.oficial - 12,
                dolarmep: dollarData.mep,
                ethereum: ethereumData.market_data.current_price.usd,
                bitcoint: bitcoinData.market_data.current_price.usd,
                litecoin: litecoinData.market_data.current_price.usd
            }
        })
        return {
            quotes: {
                dolarbnacomprador: dollarData.oficial,
                dolarbnavendedor: dollarData.oficial - 12,
                dolarmep: dollarData.mep,
                ethereum: ethereumData.market_data.current_price.usd,
                bitcoint: bitcoinData.market_data.current_price.usd,
                litecoin: litecoinData.market_data.current_price.usd
            }
        }
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

    async #getDollarData() {
        const response = await fetch('https://criptoya.com/api/dolar')
        return await response.json()
    }

    async #getEthereumData(date) {
        const ethereumResponse = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/history?date=${date}`)
        return await ethereumResponse.json()
    }

    async #getLitecoinData(date) {
        const litecoinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/litecoin/history?date=${date}`)
        return await litecoinResponse.json()
    }

    async #getBitcoinData(date) {
        const bitcoinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${date}`)
        return await bitcoinResponse.json()
    }
}

const otherQuotesService = new OtherQuotesService()

module.exports = otherQuotesService