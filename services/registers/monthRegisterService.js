const accountService = require('../accounts/accountService')
const monthRegisterRepository = require('../../repository/daos/registers/monthRegisterDao')
const { addOneYear, addOneMonth } = require('../../utils/utils')

class MonthRegisterService {
    constructor() { }

    async saveMonthRegister() {
        const openMonthRegister = await monthRegisterRepository.getOpenMonthRegister()
        const valuesToSave = await this.getAllAccountsByType()
        valuesToSave.forEach(it => accountService.resetBalance(it.accountName, it.currency))
        await monthRegisterRepository.updateMonthRegisterAndCloseIt(openMonthRegister.year, openMonthRegister.month, valuesToSave)
        await this.generateNewMonthRegister(openMonthRegister.year, openMonthRegister.month)
        return {"message": "ok"}
    }

    async generateNewMonthRegister(year, month) {
        const newYear = addOneYear(year, month)
        const newMonth = addOneMonth(month)

        await monthRegisterRepository.subirInfo({
            month: newMonth,
            year: newYear,
            status: "OPEN"
        })
    }

    // PRIVATE
    getValuesToSave(listOfAccounts) {
        const valuesToSave = []
        listOfAccounts
            .filter(it => it.balance > 0)
            .forEach(it => {
                valuesToSave.push({
                    accountName: it.name,
                    type: it.type,
                    currency: it.currency,
                    balance: it.balance
                })
            })
        return valuesToSave
    }

    async getAllAccountsByType() {
        const accountsType = ['R+', 'R-']
        let valuesToSave = []
        await Promise.all(accountsType.map(async it => {
            const values = await accountService.getAccountsByType(it);
            valuesToSave = [...valuesToSave, ...this.getValuesToSave(values)];
          }));
        return valuesToSave
    }
}

const monthRegisterService = new MonthRegisterService()

module.exports = monthRegisterService