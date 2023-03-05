const { CrudMongo } = require('../crud/crud');
const refundModel = require('../../models/database/refundMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class refundDao extends CrudMongo {
    constructor() {
        super(refundModel)
    }

}

let refundSingleton = new refundDao()

module.exports = refundSingleton