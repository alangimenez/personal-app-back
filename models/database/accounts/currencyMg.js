const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'currency';

const currencySchema = new Schema ({
    currency: {type: String},
    relatedAccounts: {type: Array}
})

const Currency = mongoose.model(coleccion, currencySchema);

module.exports = Currency;