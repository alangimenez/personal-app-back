const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'monthregisters';

const monthRegisterSchema = new Schema ({
    month: {type: String},
    year: {type: String},
    values: {type: Array}
})

const MonthRegister = mongoose.model(coleccion, monthRegisterSchema);

module.exports = MonthRegister;