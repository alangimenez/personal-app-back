const { convertRequest } = require('../utils/utils')
const otherQuotesDao = require('../repository/daos/otherQuotesDao')
const { addDays } = require('../utils/utils')
const moment = require('moment'); // require
moment().format();


class OtherQuotesService {
    constructor(){}

    async uploadNewQuote (request) {
        const quote = convertRequest(request)

        await otherQuotesDao.subirInfo(quote)
        
        return ({'message': 'ok'})
    }

    async getLastQuote () {
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