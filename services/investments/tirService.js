const cashFlowRepository = require('../../repository/daos/investments/cashflowDao');
const lastValueService = require('./lastValueService');
const { irr } = require('node-irr');
const TirModel = require('../../models/tirModel')
const TirResponse = require('../../models/tirResponse')
const tirRepository = require('../../repository/daos/investments/tirDao')
const { diffInDaysBetweenDateAndToday, roundToTwo } = require('../../utils/utils')
const moment = require('moment'); // require
moment().format();

class TirService {
    constructor() { }

    async generateTir(assets) {
        // obtiene los cashFlows de todos los bonos (cambiar repository por service)
        const allCashFlows = await cashFlowRepository.leerInfo()
        const cashFlows = allCashFlows.filter(it => assets.includes(it.ticket))

        // calculo del tir
        let arrayTir = []
        for (let i = 0; i < cashFlows.length; i++) {
            // obtiene la última cotizacion guardada de un bono en particular
            const lastValues = await lastValueService.getData()
            const index = lastValues.findIndex(it => it.simbolo == cashFlows[i].ticket)
            const remainingPayments = cashFlows[i].dateOfPayment.filter(it => moment(it).isAfter(new Date()))
            const cashflow = this.#generateConsolidedCashflow(lastValues[index].ultimoPrecio, remainingPayments.length, cashFlows[i])

            // calcula la tir y guarda la información en la base de datos
            let tirMonthly = irr(cashflow)
            let tirAnnual = Math.pow(1 + tirMonthly, 12)
            let tirAnnualRound = roundToTwo(((tirAnnual) - 1))
            let tirModel = new TirModel(
                cashFlows[i].bondName,
                new Date().toLocaleString(),
                new Date().toLocaleString(),
                tirAnnualRound)
            tirRepository.subirInfo(tirModel)

            // incorpora el resultado de la tir en un array que se devuelve posterior al bucle
            let tirResponse = new TirResponse(
                tirModel.bondName,
                cashFlows[i].company,
                cashFlows[i].start,
                cashFlows[i].finish,
                cashFlows[i].rate - 1 + 1,
                tirModel.date,
                tirModel.time,
                tirModel.tir * 100
            )
            arrayTir.push(tirResponse)
        }
        return arrayTir;
    }

    async generateTirDaily(assets) {
        // obtiene los cashFlows de todos los bonos
        const cashFlowsData = await cashFlowRepository.leerInfo()
        const cashFlows = cashFlowsData.filter(it => assets.includes(it.ticket))
        const lastValueQuotes = await lastValueService.getData()

        const tirDailyArray = new Array
        for (let i = 0; i < cashFlows.length; i++) {
            // calcula cuantos días faltan hasta el vencimiento del ticket
            const numberOfPayments = cashFlows[i].dateOfPayment.length
            const daysDiff = diffInDaysBetweenDateAndToday(new Date(cashFlows[i].dateOfPayment[numberOfPayments - 1]))
            const indexLastValue = lastValueQuotes.findIndex(it => it.simbolo == cashFlows[i].ticket)

            // generate an array with all payments by day
            const cashFlow = this.#generateDailyConsolidedCashflow(
                +lastValueQuotes[indexLastValue].ultimoPrecio - 1 + 1,
                cashFlows[i],
                daysDiff,
                numberOfPayments
            )

            // calculate tir
            let tirDaily = irr(cashFlow)
            let tirAnnual = Math.pow(1 + tirDaily, 365)
            let tirAnnualRound = roundToTwo(((tirAnnual) - 1))
            tirDailyArray.push({
                ticket: cashFlows[i].ticket,
                tirDaily: tirDaily,
                tirAnnual: tirAnnual,
                tirAnnualRound: tirAnnualRound
            })
        }
        return tirDailyArray
    }

    async getTirDaily() {
        return tirRepository.leerInfo()
    }

    async getTir() {
        return tirRepository.leerInfo()
    }

    #generateConsolidedCashflow(lastPrice, paymentQuantity, cashflowData) {
        const arrayOfPayments = new Array
        for (let j = paymentQuantity; j > 0; j--) {
            arrayOfPayments.unshift(+cashflowData.amountInterest[j + 1] + +cashflowData.amountAmortization[j + 1])
        }
        arrayOfPayments.unshift(-lastPrice)
        return arrayOfPayments
    }

    #generateDailyConsolidedCashflow(lastPrice, cashFlowsData, length, numberOfPayments) {
        const cashFlow = new Array(length);
        for (let j = 0; j < cashFlow.length; j++) {
            cashFlow[j] = 0
        }
        for (let k = 0; k < numberOfPayments; k++) {
            cashFlow[diffInDaysBetweenDateAndToday(new Date(cashFlowsData.dateOfPayment[k]))] = +cashFlowsData.amountInterest[k] + +cashFlowsData.amountAmortization[k]
        }
        cashFlow.unshift(-lastPrice)
        return cashFlow
    }
}

const tirService = new TirService()

module.exports = tirService