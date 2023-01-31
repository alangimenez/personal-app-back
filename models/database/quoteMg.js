const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'quotes';

const quotesSchema = new Schema ({
    date: {type: String},
    time: {type: String},
    quotes: {type: Array}
})

const Quotes = mongoose.model(coleccion, quotesSchema);

module.exports = Quotes;