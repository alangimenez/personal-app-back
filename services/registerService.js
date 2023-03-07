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

        let benefitMP = 1
        if (batchRegisters.benefitMP) {benefitMP = 0.3}

        let amount = 0
        batchRegisters.expenses.map((register) => {
            const eachRegister = {
                "date": batchRegisters.date,
                "debit": register.debtAccount,
                "debitCurrency": batchRegisters.currency,
                "debitAmount": (+register.debtAmount - +register.discountAmount) * benefitMP,
                "credit": batchRegisters.credit,
                "creditCurrency": batchRegisters.currency,
                "creditAmount": (+register.debtAmount - +register.discountAmount) * benefitMP,
                "comments": batchRegisters.comments
            }
            registerRepository.subirInfo(eachRegister)
            accountService.updateBalance(register.debtAmount - register.discountAmount, register.debtAccount, "add")
            amount = +amount + +eachRegister.debitAmount
        })

        await accountService.updateBalance(amount, batchRegisters.credit, "subtract")

        return ({ "message": "ok" })
    }

    async saveEarning(request) {
        const earning = convertRequest(request)

        const result = await registerRepository.subirInfo(earning)

        await accountService.updateBalance(+earning.debitAmount, earning.debit, "add")
        await accountService.updateBalance(+earning.creditAmount, earning.credit, "add")
        return result
    }
}

const registersService = new RegistersService()

module.exports = registersService