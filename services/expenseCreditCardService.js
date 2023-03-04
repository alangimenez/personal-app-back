const expenseCreditCardRepository = require('../repository/daos/expenseCreditCardDao')
const { convertRequest, addSpecificDays, transformDate } = require('../utils/utils')
const expensesService = require('./registerService')

class ExpenseCreditCardService {
    constructor() {
        this.month = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    }

    async createNewPeriod(request) {
        const creditCardData = convertRequest(request)

        const lastPeriod = await expenseCreditCardRepository.getLastPeriodByCreditCardName(creditCardData.name)

        console.log(lastPeriod)

        let periodDate = ""
        let debtAccount = ""
        if (lastPeriod.length == 0) {
            const month = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            const key = month.findIndex(it => it == creditCardData.period)
            periodDate = key + 1
            debtAccount = creditCardData.debtAccount
        } else {
            periodDate = lastPeriod[0].period + 1
            debtAccount = lastPeriod[0].debtAccount
        }

        console.log(periodDate)

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
        return result
    }

    async closeCreditCardPeriod(request) {
        const creditCardData = convertRequest(request)

        await expenseCreditCardRepository.closePeriodByNameAndPeriod(creditCardData)

        return ({ "message": "ok" })
    }

    async saveExpenseInCreditCard(request) {
        const batchExpenses = convertRequest(request)

        let benefitMP = 1
        if (batchExpenses.benefitMP) {benefitMP = 0.3}

        let period = this.month.findIndex(it => it == batchExpenses.period)
        period = period + 1

        batchExpenses.expenses.map(expense => {
            const eachExpense = {
                "date": new Date(batchExpenses.date),
                "account": expense.debtAccount,
                "amount": (expense.debtAmount - expense.discountAmount) * benefitMP,
                "comments": batchExpenses.comments
            }
            expenseCreditCardRepository.addExpenseToCreditCardByPeriod(eachExpense, batchExpenses.name, period)
        })

        return ({ "message": "ok" })
    }

    async getOpenPeriodByCreditCard(status) {
        const openPeriod = await expenseCreditCardRepository.getOpenPeriodByCreditCard(status)

        const creditCardNames = []

        openPeriod.map(it => {
            if (!creditCardNames.includes(it.name)) {
                creditCardNames.push(it.name)
            }
        })

        const creditCardWithPeriods = []
        creditCardNames.map(ccn => {
            creditCardWithPeriods.push({
                "name": ccn,
                "openPeriods": []
            })
        })

        openPeriod.map(op => {
            creditCardWithPeriods.map(ccwp => {
                if (op.name == ccwp.name) {
                    ccwp.openPeriods.push(this.month[op.period - 1])
                }
            })
        })

        creditCardWithPeriods.map(ccwp => {
            const key = openPeriod.findIndex(op => op.name == ccwp.name)
            ccwp['credit'] = openPeriod[key].debtAccount
        })

        return creditCardWithPeriods
    }

    async changeStatusOfPeriod(request) {
        const creditCardData = convertRequest(request)

        let period = this.month.findIndex(it => it == creditCardData.period)
        creditCardData.period = period + 1

        const result = await expenseCreditCardRepository.changeStatusOfPeriod(creditCardData)

        if (creditCardData.status == "PAID") {
            const creditCardPeriod = await expenseCreditCardRepository.getPeriodByCreditCard(creditCardData.name, creditCardData.period)

            const arrayOfExpenses = []
            creditCardPeriod.expenses.map(e => {
                const eachExpense = {
                    "debtAccount": e.account,
                    "debtAmount": e.amount,
                    "discountAmount": 0
                }
                arrayOfExpenses.push(eachExpense)
            })

            const batchOfExpenses = {
                "date": creditCardPeriod.paymentDate,
                "currency": "ARS",
                "credit": creditCardPeriod.debtAccount,
                "comments": `${creditCardPeriod.name} - ${creditCardPeriod.period}`,
                "expenses": arrayOfExpenses
            }

            expensesService.saveBatchExpenses(batchOfExpenses)
        }

        return result
    }

    async getExpensesByCreditCardAndPeriod(status) {
        let expenses = await expenseCreditCardRepository.getExpensesOfOpenPeriods(status)

        const response = []
        expenses.map(e => {

            const arrayOfEachExpense = []
            e.expenses.map(eachExpense => {
                const newExpense = {
                    ...eachExpense,
                    date: transformDate(eachExpense.date)
                }
                arrayOfEachExpense.push(newExpense)
            })

            const expense = {
                ...e._doc,
                "period": this.convertNumberPeriodToStringPeriod(e.period),
                expenses: arrayOfEachExpense
            }
            response.push(expense)
        })

        return response
    }

    async getExpensesByCreditCard() {
        const expenses = await expenseCreditCardRepository.leerInfo()

        const response = []
        expenses.map(e => {

            const arrayOfEachExpense = []
            e.expenses.map(eachExpense => {
                const newExpense = {
                    ...eachExpense,
                    date: transformDate(eachExpense.date)
                }
                arrayOfEachExpense.push(newExpense)
            })

            const expense = {
                ...e._doc,
                "period": this.convertNumberPeriodToStringPeriod(e.period),
                "closeDate": transformDate(e.closeDate),
                "paymentDate": transformDate(e.paymentDate),
                expenses: arrayOfEachExpense
            }
            response.push(expense)
        })

        return response
    }

    // PRIVATE

    convertStringPeriodToNumberPeriod(string) {
        let period = this.month.findIndex(it => it == string)
        return period + 1
    }

    convertNumberPeriodToStringPeriod(number) {
        return this.month[number - 1]
    }
}

const expenseCreditCardService = new ExpenseCreditCardService()

module.exports = expenseCreditCardService