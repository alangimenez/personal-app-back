const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'lastvalues';

const lastValueSchema = new Schema ({
    bondName: {type: String},
    date: {type: String},
    time: {type: String},
    lastPrice: {type: mongoose.Types.Decimal128},
    closePrice: {type: mongoose.Types.Decimal128},
    volume: {type: mongoose.Types.Decimal128}
})

const LastValue = mongoose.model(coleccion, lastValueSchema);

module.exports = LastValue;