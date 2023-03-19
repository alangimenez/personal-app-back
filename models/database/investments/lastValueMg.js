const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'lastvalues';

const lastValueSchema = new Schema ({
    ticket: {type: String},
    date: {type: String},
    price: {type: Number},
    volume: {type: Number}
})

const LastValue = mongoose.model(coleccion, lastValueSchema);

module.exports = LastValue;