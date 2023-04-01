const registerRepository = require('../repository/daos/registerDao');
const accountService = require('./accountService');
const { transformDate, convertRequest } = require('../utils/utils')

class RegistersService {
    constructor() { }

    async saveRegister(request) {
        let register = convertRequest(request)

        register.date = new Date(register.date)
        register.load = false

        await registerRepository.subirInfo(register)
        await accountService.updateBalance(register.debitAmount, register.debit, "add")
        await accountService.updateBalance(register.creditAmount, register.credit, "subtract")
        return ({ 'message': 'ok' })
    }

    async getRegisterFilterByDate(date) {
        const result = await registerRepository.getRegistersFilterByDate(date);
        return result;
    }

    async getLastTenRegisters() {
        const Registers = await registerRepository.getLastTenRegisters();
        const result = []
        Registers.map((register) => {
            result.push({
                ...register._doc,
                date: transformDate(register.date)
            }
            )
        })
        return result;
    }

    async changeRegisterstatus(id) {
        const result = await registerRepository.changeRegisterstatus(id)
        return result
    }

    async saveBatchRegisters(request) {
        let batchRegisters = convertRequest(request)
        let debitCurrency = batchRegisters.currency
        let creditCurrency = batchRegisters.currency

        // mercado pago flag
        let benefitMP = 1
        if (batchRegisters.benefitMP) { benefitMP = 0.3 }

        // investment flag
        if (batchRegisters.investment) {
            if (batchRegisters.operation === "Buy") {
                const account = await accountService.getNameByTicket(batchRegisters.expenses[0].debtAccount)
                batchRegisters.expenses[0].debtAccount = account
            } else {
                const account = await accountService.getNameByTicket(batchRegisters.credit)
                batchRegisters.credit = account
            }
        }

        let amount = 0
        batchRegisters.expenses.map((register) => {
            let debitAmount = (+register.debtAmount - +register.discountAmount) * benefitMP
            let creditAmount = (+register.debtAmount - +register.discountAmount) * benefitMP

            // investment ars to usd flag
            if (batchRegisters.arsToUsd) {
                creditAmount = batchRegisters.creditAmount
                creditCurrency = batchRegisters.creditCurrency
            }

            const eachRegister = {
                "date": batchRegisters.date,
                "debit": register.debtAccount,
                "debitCurrency": debitCurrency,
                "debitAmount": debitAmount,
                "credit": batchRegisters.credit,
                "creditCurrency": creditCurrency,
                "creditAmount": creditAmount,
                "comments": batchRegisters.comments,
                "type": batchRegisters.type
            }
            registerRepository.subirInfo(eachRegister)
            accountService.updateBalance(register.debtAmount - register.discountAmount, register.debtAccount, debitCurrency, "add")
            amount = +amount + +eachRegister.creditAmount
        })

        await accountService.updateBalance(amount, batchRegisters.credit, creditCurrency, "subtract")

        return ({ "message": "ok" })
    }

    async saveEarning(request) {
        const earning = convertRequest(request)

        const result = await registerRepository.subirInfo(earning)

        await accountService.updateBalance(+earning.debitAmount, earning.debit, earning.debitCurrency, "add")
        await accountService.updateBalance(+earning.creditAmount, earning.credit, earning.creditCurrency, "add")
        return result
    }
}

const registersService = new RegistersService()

module.exports = registersService