const cashFlowRepository = require('../../repository/daos/investments/cashflowDao');
const { diffInDaysBetweenDateAndToday, transformDate, roundToTwo } = require('../../utils/utils');
const investmentService = require('./investmentService');

class CashFlowService {
    constructor() { }
    async getCashFlow() {
        return await cashFlowRepository.leerInfo()
    }

    async saveCashFlow(cashFlow) {

        const dateOfPayments = []
        cashFlow.dateOfPayment.map(dop => dateOfPayments.push(new Date(dop)))

        return await cashFlowRepository.subirInfo({
            "ticket": cashFlow.ticket,
            "company": cashFlow.company,
            "start": cashFlow.start,
            "finish": cashFlow.finish,
            "rate": cashFlow.rate,
            "dateOfPayment": dateOfPayments,
            "amountInterest": cashFlow.amountInterest,
            "amountAmortization": cashFlow.amountAmortization
        })
    }

    async getAllCashFlowSorted() {
        const cashFlows = await cashFlowRepository.leerInfo()
        const flowOfInterest = []

        cashFlows.map((bond) => {
            for (let i = 0; i < bond.dateInterest.length; i++) {
                const [year, month, day] = bond.dateInterest[i].split('/')
                flowOfInterest.push({
                    "ticket": bond.ticket,
                    "dateInterest": new Date(+year, +month - 1, +day),
                    "amountInterest": bond.amountInterest[i],
                    "remainingsDays": diffInDaysBetweenDateAndToday(new Date(+year, +month - 1, +day))
                })
            }
        })

        const investments = await investmentService.getInvestments()
        const response = []

        // order by date, consider actualQuantity, delete old flows of money and delete flows that aren't in portfolio
        flowOfInterest.sort((a, b) => a.dateInterest - b.dateInterest)
        flowOfInterest.map((interest) => {
            const index = investments.findIndex((asset) => asset.ticket == interest.ticket)
            if (interest.remainingsDays >= 0 && index >= 0) {
                interest.dateInterest = transformDate(interest.dateInterest)
                interest.amountInterest = roundToTwo(interest.amountInterest * investments[index].actualQuantity)
                response.push(interest)
            }
        })

        return (response)
    }
}

const cashFlowService = new CashFlowService()

module.exports = cashFlowService