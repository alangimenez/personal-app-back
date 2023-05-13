const accountRepository = require('../repository/daos/accountDao');
const { convertRequest } = require('../utils/utils');
const duplicateAccount = require('../errors/DuplicateAccount')

class AccountService {
    constructor() {}

    async newAccount (request) {
        let account = convertRequest(request)

        let checkIfAccountExist = await accountRepository.getAccountByNameAndCurrency(account.name, account.currency)
        if (checkIfAccountExist.length > 0) {
            duplicateAccount(account.name, account.currency)
        }

        const result = await accountRepository.subirInfo(account)
        return result
    }

    async updateBalance (amount, account, currency, operation) {
        const accountInfo = await accountRepository.getAccountByNameAndCurrency(account, currency);
        operation == "add" ? accountInfo[0].balance = +accountInfo[0].balance + amount : accountInfo[0].balance = +accountInfo[0].balance - amount
        await accountRepository.updateBalanceByNameAndCurrency(account, currency, accountInfo[0].balance)
        return ({"message": "ok"})
    }

    async getAllAccounts () {
        return await accountRepository.leerInfo()
    }

    async getExpenseAccounts() {
        const result =  await accountRepository.getExpenseAccounts()
        result.sort((a, b) => a.name.localeCompare(b.name))
        return result
    }

    async getLiquidAccounts() {
        const accountsWithDetail = await accountRepository.getLiquidAccounts()
        const accounts = []
        accountsWithDetail.map(it => accounts.push(it.name))
        return accounts
    }

    async getLiquidAndFciAccounts() {
        const accounts = await accountRepository.getLiquidAndFciAccounts()
        return accounts
    }

    async getAccountsByType(type) {
        const accountsByType = await accountRepository.getAccountsByType(type)
        const arrayOfAccountName = []
        accountsByType.map(it => arrayOfAccountName.push(it.name))
        return arrayOfAccountName
    }

    async getNameByTicket(ticket) {
        const account = await accountRepository.getAccountByTicket(ticket)
        return account[0].name
    }
}

const accountService = new AccountService()

module.exports = accountService