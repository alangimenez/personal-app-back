const expenseCreditCardRepository = require('../repository/daos/expenseCreditCardDao')
const { convertRequest, addSpecificDays } = require('../utils/utils')

class ExpenseCreditCardService {
    constructor(){}

    async createNewPeriod (request) {
        const creditCardData = convertRequest(request)

        const lastPeriod = await expenseCreditCardRepository.getLastPeriodByCreditCardName(creditCardData.name)

        let periodDate = ""
        let debtAccount = ""
        if (lastPeriod.length == 0) {
            const month = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            const key = month.findIndex(it => it == creditCardData.period)
            periodDate = key + 1
            debtAccount = creditCardData.debtAccount
        } else {
            periodDate = lastPeriod.period + 1
            debtAccount = lastPeriod.debtAccount
        }

        const newPeriod = {
            "name": creditCardData.name,
            "debtAccount": debtAccount,
            "closeDate": creditCardData.closeDate,
            "paymentDate": creditCardData.paymentDate,
            "period": periodDate,
            "expenses": [],
            "status": "OPEN"
        }

        console.log(newPeriod)

        const result = await expenseCreditCardRepository.subirInfo(newPeriod)
        return newPeriod
    }

    async closeCreditCardPeriod (request) {
        const creditCardData = convertRequest(request)

        await expenseCreditCardRepository.closePeriodByNameAndPeriod(creditCardData)

        return ({"message": "ok"})
    }
}

const expenseCreditCardService = new ExpenseCreditCardService()

module.exports = expenseCreditCardService