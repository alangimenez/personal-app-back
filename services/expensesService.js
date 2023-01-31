const expensesRepository = require('../repository/daos/expensesDao');
const accountService = require('../services/accountService');

class ExpensesService {
    constructor() {}

    async saveExpense (expense) {
        let register;
        if (typeof(expense) == 'string') {
            register = JSON.parse(expense)
        } else {
            register = expense
        }

        register.date = new Date(register.date)

        await expensesRepository.subirInfo(register)
        await accountService.updateBalance(register.debitAmount, register.debit, "add")
        await accountService.updateBalance(register.creditAmount, register.credit, "subtract")
        return ({'message': 'ok'})
    }

    async getExpenseFilterByDate (date) {
        const result = await expensesRepository.getExpensesFilterByDate(date);
        return result;
    }

    async getLastTenExpenses () {
        const result = await expensesRepository.getLastTenExpenses();
        return result;
    }
}

const expensesService = new ExpensesService()

module.exports = expensesService