const { CrudMongo } = require('../../crud/crud');
const userModel = require('../../../models/database/user/userMg');

class userDao extends CrudMongo {
    constructor() {
        super(userModel)
    }

    async getUserByEmail(email) {
        try {
            return await this.model.find({ email: email }, { __v: 0 });
        } catch (e) {
            console.log("can't read user by email")
        }
    }
}

let userSingleton = new userDao()

module.exports = userSingleton