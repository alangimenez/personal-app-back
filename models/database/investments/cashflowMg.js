const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'cashflow';

const cashflowSchema = new Schema ({
    ticket: {type: String},
    company: {type: String},
    start: {type: String},
    finish: {type: String},
    rate: {type: Number},
    dateInterest: {type: Array},
    amountInterest: {type: Array}
})

const Cashflow = mongoose.model(coleccion, cashflowSchema);

module.exports = Cashflow;