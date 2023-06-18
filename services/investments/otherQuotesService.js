const otherQuotesDao = require('../../repository/daos/investments/otherQuotesDao')
const coinGeckoApiClient = require('../../clients/coinGeckoApiClient')
const criptoYaApiClient = require('../../clients/criptoYaApiClient')
const OtherQuotesModel = require('../../models/model/otherQuotesModel')
const { addDays } = require('../../utils/utils')
const moment = require('moment');
moment().format();

class OtherQuotesService {
    constructor() { }

    async uploadNewQuote() {
        const lastQuote = await otherQuotesDao.getLastQuote()
        const lastQuotesDate = lastQuote[0].date
        const dateForCriptoFetch = moment(lastQuotesDate).add(60, 'hours').format('DD-MM-YYYY')

        const dollarData = await criptoYaApiClient.getDollarData()
        const ethereumQuote = await coinGeckoApiClient.getEthereumQuoteByDate(dateForCriptoFetch)
        const litecoinQuote = await coinGeckoApiClient.getLitecoinQuoteByDate(dateForCriptoFetch)
        const bitcoinQuote = await coinGeckoApiClient.getBitcoinQuoteByDate(dateForCriptoFetch)

        const quotes = new OtherQuotesModel(
            dollarData.oficial,
            dollarData.oficial - 12,
            dollarData.mep,
            ethereumQuote,
            litecoinQuote,
            bitcoinQuote
        )

        await otherQuotesDao.subirInfo({
            date: moment(lastQuotesDate).add(24, 'hours').toDate(),
            quotes: quotes
        })
        return { quotes: quotes }
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