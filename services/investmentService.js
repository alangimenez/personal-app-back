const investmentRepository = require('../repository/daos/investmentDao');
const lastValueService = require('./lastValueService')

class InvestmentService {
    constructor () {}

    async saveInvestment(response) {
        let investment;
        if (typeof(response) == 'string') {
            investment = JSON.parse(response)
        } else {
            investment = response
        }
        switch (investment.operation) {
            case "Buy":
                await this.operationBuy(investment)
                break;
            case "Sell": 
                await this.operationSell(investment)
                break; 
            default: 
                break
        }
    }

    async getInvestments() {
        const investments =  await investmentRepository.leerInfo()
        const investmentsResponse = []

        investments.map((e) => {
            investmentsResponse.push({
                ...e._doc,
                operationQuantity: e.operationQuantity.toString(),
                operationPrice: e.operationPrice.toString(),
                actualQuantity: e.actualQuantity.toString(),
                commission: e.commission.toString()
            })
        })
        return investmentsResponse
    }

    async getPortfolio() {
        const operations = await investmentRepository.getRemainingOperations()
        const lastValuePortfolio = await lastValueService.getAll()
        const portfolio = []
        operations.map(operation => {
            const i = portfolio.findIndex(asset => asset.ticket == operation.ticket)
            if (i >= 0) {
                portfolio[i].actualQuantity = +portfolio[i].actualQuantity + +operation.actualQuantity.toString()
            } else {
                portfolio.push(operation)
            }
        })
        const response = []
        portfolio.map(asset => {
            let toPush = {
                ...asset._doc,
                operationQuantity: +asset.operationQuantity.toString(),
                operationPrice: +asset.operationPrice.toString(),
                actualQuantity: +asset.actualQuantity.toString(),
                commission: +asset.commission.toString()
            }
            response.push(toPush)
        })

        response.map(assetResponse => {
            const key = lastValuePortfolio.findIndex(register => register.bondName == assetResponse.ticket)
            assetResponse.actualPrice = lastValuePortfolio[key].closePrice
        })

        return response
    }

    // PRIVATE

    async operationBuy(register) {
        register = {
            ...register,
            "actualQuantity": register.operationQuantity
        }
        await investmentRepository.subirInfo(register)
    }

    async operationSell(register) {
        const operations = await investmentRepository.getOperationsByTicket(register.ticket);
        operations.sort((a, b) => a.operationDate - b.operationDate);
        let remainingQuantity = register.operationQuantity

        // TODO: consider when operationQuantity is greater than actualQuantity as a new error
        for (let i = 0; i < operations.length; i++) {
            if (remainingQuantity > operations[i].actualQuantity) {
                await investmentRepository.updateInvestmentRegister(operations[i]._id, 0);
                remainingQuantity = remainingQuantity - operations[i].actualQuantity;
            } else {
                await investmentRepository.updateInvestmentRegister(operations[i]._id, operations[i].actualQuantity - remainingQuantity);
                remainingQuantity = 0
            }
        }
    }
}

const investmentService = new InvestmentService()

module.exports = investmentService