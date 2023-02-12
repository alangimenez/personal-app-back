const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'investments';

const investmentSchema = new Schema ({
    ticket: {type: String},
    operationDate: {type: String},
    operationQuantity: {type: mongoose.Types.Decimal128},
    operationPrice: {type: mongoose.Types.Decimal128},
    operationCurrency: {type: String},
    assetType: {type: String},
    operation: {type: String},
    actualQuantity: {type: mongoose.Types.Decimal128},
    commission: {type: mongoose.Types.Decimal128},
    commissionCurrency: {type: String}
})

const Investment = mongoose.model(coleccion, investmentSchema);

module.exports = Investment;