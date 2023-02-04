const expensesRepository = require('../repository/daos/expensesDao');
const accountService = require('../services/accountService');
const { transformDate } = require('../utils/utils')

class ExpensesService {
    constructor() { }

    async saveExpense(expense) {
        let register;
        if (typeof (expense) == 'string') {
            register = JSON.parse(expense)
        } else {
            register = expense
        }

        register.date = new Date(register.date)
        register.load = false

        // console.log(expense)

        await expensesRepository.subirInfo(register)
        await accountService.updateBalance(register.debitAmount, register.debit, "add")
        await accountService.updateBalance(register.creditAmount, register.credit, "subtract")
        return ({ 'message': 'ok' })
    }

    async getExpenseFilterByDate(date) {
        const result = await expensesRepository.getExpensesFilterByDate(date);
        return result;
    }

    async getLastTenExpenses() {
        const expenses = await expensesRepository.getLastTenExpenses();
        const result = []
        expenses.map((expense) => {
            result.push({
                ...expense._doc,
                date: transformDate(expense.date)
            }
            )
        })
        return result;
    }

    async changeExpenseStatus(id) {
        const result = await expensesRepository.changeExpenseStatus(id)
        return result
    }

    async saveBatchExpenses(request) {
        let batchExpenses;
        if (typeof (request) == 'string') {
            batchExpenses = JSON.parse(request)
        } else {
            batchExpenses = request
        }

        let amount = 0
        batchExpenses.expenses.map((expense) => {
            const eachExpense = {
                "date": batchExpenses.date,
                "debit": expense.debtAccount,
                "debitCurrency": batchExpenses.currency,
                "debitAmount": expense.debtAmount,
                "credit": batchExpenses.credit,
                "creditCurrency": batchExpenses.currency,
                "creditAmount": expense.debtAmount,
                "comments": batchExpenses.comments
            }
            expensesRepository.subirInfo(eachExpense)
            amount = amount + +expense.debtAmount
        })

        await accountService.updateBalance(amount, batchExpenses.credit, "subtract")

        return ({ "message": "ok" })
    }
}

const expensesService = new ExpensesService()

module.exports = expensesService