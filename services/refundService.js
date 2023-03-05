const refundRepository = require('../repository/daos/refundDao')
const { convertRequest } = require('../utils/utils')

class RefundService {
    constructor() { }

    async createExpenseWithRefund(request) {
        const expenseWithRefund = convertRequest(request)

        let benefitMP = 1
        if (expenseWithRefund.benefitMP) { benefitMP = 0.3 }

        let amount = 0
        const expenses = []
        expenseWithRefund.expenses.map((register) => {
            const eachRegister = {
                "debit": register.debtAccount,
                "debitCurrency": expenseWithRefund.currency,
                "debitAmount": (+register.debtAmount - +register.discountAmount) * benefitMP,
                "credit": expenseWithRefund.credit,
                "creditCurrency": expenseWithRefund.currency,
                "creditAmount": (+register.debtAmount - +register.discountAmount) * benefitMP,
                "comments": expenseWithRefund.comments
            }
            expenses.push(eachRegister)
            amount = amount + eachRegister.debitAmount
        })

        await refundRepository.subirInfo({
            "date": expenseWithRefund.date,
            "expenses": expenses,
            "total": amount,
            "status": "OPEN"
        })

        return ({ "message": "ok" })
    }

    async uploadRefund(request) {
        const refund = convertRequest(request)


    }

    async getAllRefunds() {
        return await refundRepository.leerInfo()
    }
}

const refundService = new RefundService()

module.exports = refundService