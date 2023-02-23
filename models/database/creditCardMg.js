const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'creditcard';

const creditCardSchema = new Schema ({
    name: {type: String},
    debtAccount: {type: String}
    /* period: {type: String},
    closeDate: {type: Date},
    paymentDate: {type: Date} */
})

const CreditCard = mongoose.model(coleccion, creditCardSchema);

module.exports = CreditCard;