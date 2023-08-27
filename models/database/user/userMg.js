const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const coleccion = 'users';

const userSchema = new Schema ({
    user: {type: String},
    email: {type: String},
    password: {type: String},
    accessToken: {type: String}, 
    refreshToken: {type: String},
    accessTokenExpires: {type: Date},
    refreshTokenExpires: {type: Date}
})

const User = mongoose.model(coleccion, userSchema);

module.exports = User;