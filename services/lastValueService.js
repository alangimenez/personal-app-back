const lastValueRepository = require('../repository/daos/lastValueDao.js');
const tirRepository = require('../repository/daos/tirDao');
const Quote = require('../models/quote');

class LastValueService {
    constructor() {}

    async deleteAll() {
        await lastValueRepository.eliminarTodos()
    }

    async deleteByBondName(bondName) {
        await lastValueRepository.eliminarPorBondname(bondName)
    }

    async saveInfo(response) {
        let arrayQuotes;
        if (typeof(response) == 'string') {
            arrayQuotes = JSON.parse(response)
            arrayQuotes = arrayQuotes.quotes
        } else {
            arrayQuotes = response
        }

        const bonds = await lastValueRepository.leerInfo()

        const tiempoTranscurrido = Date.now();
        const hoy = new Date(tiempoTranscurrido);

        for (let i = 0; i < arrayQuotes.length; i++) {
            const indexBond = bonds.findIndex((e) => e.ticket == arrayQuotes[i].ticket)
            console.log(indexBond)
            if (indexBond >= 0) {
                arrayQuotes[i].price = arrayQuotes[i].price.replace(".","")
                arrayQuotes[i].price = arrayQuotes[i].price.replace(",",".")
                arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(".","")
                arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(",",".")

                if (arrayQuotes[i].price != bonds[indexBond].price || 
                    arrayQuotes[i].volumen != bonds[indexBond].volumen) {
                        lastValueRepository.modifyValues(arrayQuotes[i])
                }
            } else {
                arrayQuotes[i].price = arrayQuotes[i].price.replace(".","")
                arrayQuotes[i].price = arrayQuotes[i].price.replace(",",".")
                arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(".","")
                arrayQuotes[i].volumen = arrayQuotes[i].volumen.replace(",",".")
                const quote = new Quote(
                    arrayQuotes[i].ticket,
                    hoy.toLocaleString(),
                    parseFloat(arrayQuotes[i].price),
                    parseFloat(arrayQuotes[i].volumen)
                )
    
                // guardado de información
                lastValueRepository.subirInfo(quote)
            }
        }
        return {"message": "ok"}
    }

    async getInfoByBondName(bondName) {
        const result =  await lastValueRepository.leerInfoPorBondname(bondName);
        return result[0]
    }

    async getAll() {
        let lastValues = await lastValueRepository.leerInfo()

        let response = []
        for (let i = 0; i < lastValues.length; i++) {
            response.push({
                bondName: lastValues[i].bondName,
                date: lastValues[i].date,
                time: lastValues[i].time,
                lastPrice: +lastValues[i].lastPrice.toString(),
                closePrice: +lastValues[i].closePrice.toString(),
                volume: +lastValues[i].volume.toString()
            })
        }
        return response
    }

    async getQuotesWithTir() {
        const quotes = await lastValueRepository.leerInfo();
        const tir = await tirRepository.leerInfo();
        const quotesResponse = []
        for (let i = 0; i < quotes.length; i++) {
            const index = tir.findIndex((e) => e.bondName == quotes[i].bondName);
            if (index >= 0) {
                quotesResponse.push({
                    "bondName" : quotes[i].bondName,
                    "date": quotes[i].date,
                    "time": quotes[i].time,
                    "lastPrice": +quotes[i].lastPrice.toString(),
                    "closePrice": +quotes[i].closePrice.toString(),
                    "volume": +quotes[i].volume.toString(),
                    "tir": +tir[index].tir.toString()
                })
            }
        }
        return quotesResponse
    }
}

const lastValueService = new LastValueService()

module.exports = lastValueService