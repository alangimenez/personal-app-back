const { CrudMongo } = require('../../crud/crud');
const monthRegisterModel = require('../../../models/database/registers/monthRegisterMg');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class monthRegisterDao extends CrudMongo {
    constructor() {
        super(monthRegisterModel)
    }
}

let monthRegisterSingleton = new monthRegisterDao()

module.exports = monthRegisterSingleton