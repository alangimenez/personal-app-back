const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'expenses';

const expenseSchema = new Schema ({
    date: {type: Date},
    debit: {type: String},
    debitCurrency: {type: String},
    credit: {type: String},
    creditCurrency: {type: String},
    debitAmount: {type: Number},
    creditAmount: {type: Number},
    comments: {type: String},
    load: {type: Boolean}
})

const Expense = mongoose.model(coleccion, expenseSchema);

module.exports = Expense;