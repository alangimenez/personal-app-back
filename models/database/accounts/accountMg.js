const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'account';

const accountSchema = new Schema ({
    name: {type: String},
    type: {type: String},
    assetType: {type: String},
    ticket: {type: String},
    balance: {type: Number},
    currency: {type: String},
    quantity: {type: Number}
})

const Account = mongoose.model(coleccion, accountSchema);

module.exports = Account;