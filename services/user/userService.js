const userDao = require('../../repository/daos/user/userDao')
const { convertRequest } = require('../../utils/utils')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('../../config/config.environments');

class UserService {
    constructor() { }

    async registerNewUser(request) {
        const user = convertRequest(request)
        let hashPassword = ""
        try {
            hashPassword = await bcrypt.hash(user.password, 10)
        } catch (e) {
            console.log(e)
        }

        await userDao.subirInfo({
            "email": user.email,
            "password": hashPassword
        })

        return {"message": "ok"}
    }

    async loginUser(request) {
        const user = convertRequest(request)
        let token = ""

        const dataUser = await userDao.getUserByEmail(user.email)

        const passwordCheck = await bcrypt.compare(user.password, dataUser[0].password)

        if (passwordCheck) {
            token = jwt.sign(
                {
                    userId: dataUser[0]._id,
                    userEmail: dataUser[0].email
                },
                config.PRIVATE_KEY,
                { expiresIn: "1h"}
            )
        } else {
            return {"message": "Error"}
        }

        return {
            "email": dataUser[0].email,
            "token": token
        }
    }
}

const userService = new UserService()

module.exports = userService