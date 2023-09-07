const quotesRepository = require('../../repository/daos/investments/quotesDao')
const userService = require('../user/userService')
const Quote = require('../../models/quote');
const QuotesModel = require('../../models/model/quotesModel')
const iolApiClient = require('../../clients/iolApiClient')
const { getActualDayInZero } = require('../../utils/utils')
const cashflowRepository = require('../../repository/daos/investments/cashflowDao')

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
        const uploadedBonds = await cashflowRepository.leerInfo()
        const listOfUploadedBonds = this.#getListOfUploadedBonds(uploadedBonds)

        const onQuotes = await iolApiClient.getOnQuotes(token)
        const adrQuotes = await iolApiClient.getAdrQuotes(token)
        const publicBondsQuotes = await iolApiClient.getPublicBondsQuotes(token)
        const onQuotesFiltered = this.#getAssetsFiltered(onQuotes.titulos, listOfUploadedBonds)
        const adrQuotesFiltered = this.#getAssetsFiltered(adrQuotes.titulos, listOfUploadedBonds)
        const publicBondsQuotesFiltered = this.#getAssetsFiltered(publicBondsQuotes.titulos, listOfUploadedBonds)

        const allQuotes = {
            obligacionesNegociables: onQuotesFiltered,
            adr: adrQuotesFiltered,
            publicBonds: publicBondsQuotesFiltered
        }
        const quotes = new QuotesModel(getActualDayInZero(), allQuotes)
        await quotesRepository.subirInfo(quotes)

        return allQuotes
    }

    #getListOfUploadedBonds(uploadedBonds) {
        const listOfUploadedBonds = []
        uploadedBonds.forEach(value => {
            listOfUploadedBonds.push(value.ticket)
        })
        return listOfUploadedBonds
    }

    #getAssetsFiltered(assets, listOfFilter) {
        return assets.filter(it => listOfFilter.includes(it.simbolo))
    }
}

const quotesService = new QuotesService()

module.exports = quotesService