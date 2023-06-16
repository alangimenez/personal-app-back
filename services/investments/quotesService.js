const quotesRepository = require('../../repository/daos/investments/quotesDao')
const lastValueService = require('./lastValueService.js')
const userService = require('../user/userService')
const Quote = require('../../models/quote');
const fetch = require('node-fetch')

class QuotesService {
    constructor() { }

    async deleteAllQuotesByBondName(bondName) {
        return await quotesRepository.eliminarTodos(bondName);
    }

    async saveInfo(response) {
        let arrayQuotes;
        if (typeof(response) == 'string') {
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
            arrayQuotes[i].lastPrice = arrayQuotes[i].lastPrice.replace(".","")
            arrayQuotes[i].lastPrice = arrayQuotes[i].lastPrice.replace(",",".")
            arrayQuotes[i].value = arrayQuotes[i].value.replace(".","")
            arrayQuotes[i].value = arrayQuotes[i].value.replace(",",".")
            arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(".","")
            arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(",",".")
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
        return {"message": "ok"}
    }

    async saveInfoFromIol() {
        const token = await userService.getAccessTokenToOperateIol()

        const onQuotes = await this.#getOnQuotes(token)
        const adrQuotes = await this.#getAdrQuotes(token)
        const publicBondsQuotes = await this.#getPublicBondsQuotes(token)

        await quotesRepository.subirInfo({
            date: new Date(),
            quotes: {
                obligacionesNegociables: onQuotes,
                adr: adrQuotes,
                publicBonds: publicBondsQuotes
            }
        })
    }

    async #getOnQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/Cotizaciones/obligacionesNegociables/argentina/Todos`, requestOptions)
        return await quotesResponse.json() 
    }

    async #getAdrQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/Cotizaciones/aDRs/estados_Unidos/Todos`, requestOptions)
        return await quotesResponse.json() 
    }

    async #getPublicBondsQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/Cotizaciones/bonos/bCBA/argentina`, requestOptions)
        return await quotesResponse.json() 
    }
}

const quotesService = new QuotesService()

module.exports = quotesService