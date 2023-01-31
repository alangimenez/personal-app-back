const { CrudMongo } = require('../crud/crud');
const lastValue = require('../../models/database/lastValueMg.js');
// const { ErrorHandler } = require('../../../error/error');
// const error = new ErrorHandler();

class lastValueDao extends CrudMongo {
    constructor() {
        super(lastValue)
    }

    /* async eliminarTodos(bondName) {
        try {
            const result = await this.model.deleteMany();
            return this.leerInfo();
        } catch (e) {
            console.log('cant eliminar info')
            // return error.errorProcess("CRUD Error", `El Crud ha tenido un error -> ` + e.message, res);
        }
    } */

    async modifyValues(bond) {
        try {
            const result = await this.model.updateOne({bondName: bond.name}, {$set: {closePrice: bond.closePrice, lastPrice: bond.lastPrice, volume: bond.volumen}})
            return result
        } catch (e) {
            console.log("Can't delete info in modifyValues")
        }
    }
}

let lastValueSingleton = new lastValueDao()

module.exports = lastValueSingleton