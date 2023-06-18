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

    async getUser(user) {
        try {
            return await this.model.find({ user: user }, { __v: 0 });
        } catch (e) {
            console.log("can't read user by user")
        }
    }

    async editUser(data) {
        try {
            return await this.model.updateOne({user: data.user}, {$set: {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                accessTokenExpires: data.accessTokenExpires,
                refreshTokenExpires: data.refreshTokenExpires
            }});
        } catch (e) {
            console.log("can't edit info: " + e.message)
        }
    }
}

let userSingleton = new userDao()

module.exports = userSingleton