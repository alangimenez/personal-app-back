const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'users';

const userSchema = new Schema ({
    email: {type: String},
    password: {type: String}
})

const User = mongoose.model(coleccion, userSchema);

module.exports = User;