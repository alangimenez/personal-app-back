const assetTypeRepository = require('../repository/daos/assetTypeDao')

class AssetType {
    constructor(){}

    async getAllAssetType() {
        const assetTypes = await assetTypeRepository.leerInfo()
        const response = []
        assetTypes.map(at => response.push({
            "assetType": at.assetType,
            "assets": at.ticketAssociated
        }))
        return response
    }

    async createAssetType(request) {
        let assetType;
        if (typeof(request) == 'string') {
            assetType = JSON.parse(request)
        } else {
            assetType = request
        }

        return await assetTypeRepository.subirInfo(assetType)
    }

    async associateTicketWithAssetType(request) {
        let association;
        if (typeof(request) == 'string') {
            association = JSON.parse(request)
        } else {
            association = request
        }

        const result = await assetTypeRepository.associateTicketWithAssetType(association.ticket, association.assetType)
        return result
    }
}

const assetTypeService = new AssetType()

module.exports = assetTypeService