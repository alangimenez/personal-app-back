const quotesRepository = require('../../repository/daos/investments/quotesDao')
const userService = require('../user/userService')
const Quote = require('../../models/quote');
const iolApiClient = require('../../clients/iolApiClient')

class QuotesService {
    constructor() { }

    async deleteAllQuotesByBondName(bondName) {
        return await quotesRepository.eliminarTodos(bondName);
    }

    async saveInfo(response) {
        let arrayQuotes;
        if (typeof (response) == 'string') {
            arrayQuotes = JSON.parse(response)
            arrayQuotes = arrayQuotes.quotes
        } else {
            arrayQuotes = response
        }

        // convert response in model for persist in DB
        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);
        let arrayQuotesToPersist = []
        for (let i = 0; i < arrayQuotes.length; i++) {
            arrayQuotes[i].lastPrice = arrayQuotes[i].lastPrice.replace(".", "")
            arrayQuotes[i].lastPrice = arrayQuotes[i].lastPrice.replace(",", ".")
            arrayQuotes[i].value = arrayQuotes[i].value.replace(".", "")
            arrayQuotes[i].value = arrayQuotes[i].value.replace(",", ".")
            arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(".", "")
            arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(",", ".")
            const quote = new Quote(
                arrayQuotes[i].name,
                hoy.toLocaleDateString(),
                hoy.toLocaleTimeString(),
                parseFloat(arrayQuotes[i].value),
                parseFloat(arrayQuotes[i].lastPrice),
                parseFloat(arrayQuotes[i].volumen)
            )
            arrayQuotesToPersist.push(quote)
        }

        // save info
        quotesRepository.subirInfo({
            "date": hoy.toLocaleDateString(),
            "time": hoy.toLocaleTimeString(),
            "quotes": arrayQuotesToPersist
        })

        // response
        return { "message": "ok" }
    }

    async saveInfoFromIol() {
        const token = await userService.getAccessTokenToOperateIol()

        const onQuotes = await iolApiClient.getOnQuotes(token)
        const adrQuotes = await iolApiClient.getAdrQuotes(token)
        const publicBondsQuotes = await iolApiClient.getPublicBondsQuotes(token)

        const allQuotes = {
            obligacionesNegociables: onQuotes,
            adr: adrQuotes,
            publicBonds: publicBondsQuotes
        }
        const quotes = new QuotesModel(new Date(), allQuotes)

        await quotesRepository.subirInfo(quotes)

        return allQuotes
    }
}

const quotesService = new QuotesService()

module.exports = quotesService