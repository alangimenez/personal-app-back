const investmentRepository = require('../repository/daos/investmentDao');
const lastValueService = require('./lastValueService');
const assetTypeService = require('../services/assetTypeService');

class InvestmentService {
    constructor() { }

    async saveInvestment(response) {
        let investment;
        if (typeof (response) == 'string') {
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

        return ({ "message": "ok" })
    }

    async getInvestments() {
        const investments = await investmentRepository.leerInfo()
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
        const assetTypeDetail = await assetTypeService.getAllAssetType()

        // agrupa las operaciones en una sola tenencia
        const portfolio = []
        operations.map(operation => {
            const i = portfolio.findIndex(asset => asset.ticket == operation.ticket)
            if (i >= 0) {
                portfolio[i].actualQuantity = +portfolio[i].actualQuantity + +operation.actualQuantity.toString()
            } else {
                portfolio.push(operation)
            }
        })

        // actualiza el precio para la valuacion del activo
        /* portfolio.map(assetResponse => {
            const key = lastValuePortfolio.findIndex(register => register.ticket == assetResponse.ticket)
            assetResponse['actualPrice'] = lastValuePortfolio[key].price
            console.log(assetResponse)
        }) */

        const response = []
        for (let i = 0; i < portfolio.length; i++) {
            const key = lastValuePortfolio.findIndex(register => register.ticket == portfolio[i].ticket)
            if (key >= 0) {
                const newElement = {
                    ...portfolio[i]._doc,
                    'actualPrice': lastValuePortfolio[key].price
                }
                response.push(newElement)
            }
        }

        const subtotalByAssetType = []
        assetTypeDetail.map(atp => {
            let value = 0
            const assetsMatching = response.filter(a => a.assetType == atp.assetType)
            if (assetsMatching.length > 0) {
                assetsMatching.map(am => value = value + (am.actualQuantity * am.actualPrice))
            }
            const typeOfAsset = {
                "assetType": atp.assetType,
                "subtotal": value
            }
            subtotalByAssetType.push(typeOfAsset)
        })

        console.log(response)
        const detailByAssetType = []
        assetTypeDetail.map(atp => {
            let value = 0
            let subDetail = []
            atp.assets.map(atpdetail => {
                const assetMatch = response.filter(a => a.ticket == atpdetail)
                if (assetMatch.length > 0) {
                    assetMatch.map(asset => {
                        value = value + (asset.actualQuantity * asset.actualPrice)
                        const element = {
                            "ticket": asset.ticket,
                            "subtotal": value
                        }
                        subDetail.push(element)
                    })

                }
            })
            const newElement = {
                "value": atp.assetType,
                "subdetail": subDetail
            }
            detailByAssetType.push(newElement)
        })

        const finalResponse = {
            "total": subtotalByAssetType,
            "detail": detailByAssetType
        }

        // TODO: chequear porque el subtotal de la key total no coincide 
        // con la sumatoria de subtotales de detail por assets

        /*
        const response = {
            "total": {
                "adr": 2000,
                "fci": 1000,
                "liquidez": 50
            },
            "detail": [
                "value": "adr",
                "detail": [
                    {"name": "IRSA", "value": 1500},
                    {"name": "YPF", "value": 500}
                ],
                "value": "fci",
                "detail": [
                    {"name": "FCI acciones", "value": 750},
                    {"name": "FCI liquido", "value": 250}
                ],
                "value": "liquidez",
                "detail": [
                    {"name": "banco", "value": 40},
                    {"name": "caja", "value": 10}
                ]
            ]
        }
        */

        return finalResponse
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