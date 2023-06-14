const userDao = require('../../repository/daos/user/userDao')
const { convertRequest } = require('../../utils/utils')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('../../config/config.environments');
const fetch = require('node-fetch')
const { IOL_USER, IOL_PASSWORD } = require('../../config/config.environments')
const moment = require('moment');

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

        return { "message": "ok" }
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
                { expiresIn: "1h" }
            )
        } else {
            return { "message": "Error" }
        }

        return {
            "email": dataUser[0].email,
            "token": token
        }
    }

    async getAccessTokenToOperateIol() {
        const token = await userDao.getUser("IOL")

        if (moment(new Date()).isBefore(token[0].accessTokenExpires)) {
            return token[0].accessToken
        }

        if (moment(new Date()).isBefore(token[0].refreshTokenExpires)) {
            return this.#getRefreshTokenFromIol(token[0].refreshToken)
        }

        return this.#getAccessTokenFromIol()
    }

    async #getRefreshTokenFromIol(refreshToken) {
        const tokenResponse = await fetch(
            `https://api.invertironline.com/token`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    refresh_token: refreshToken,
                    grant_type: "refresh_token"
                })
            }
        )
        const tokenData = await tokenResponse.json()
        await this.#saveTokenFromIol(tokenData)
        return tokenData.access_token
    }

    async #getAccessTokenFromIol() {
        const tokenResponse = await fetch(
            `https://api.invertironline.com/token`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    username: IOL_USER,
                    password: IOL_PASSWORD,
                    grant_type: "password"
                })
            }
        )
        const tokenData = await tokenResponse.json()
        await this.#saveTokenFromIol(tokenData)
        return tokenData.access_token
        // console.log(new Date('Wed, 14 Jun 2023 21:32:31 GMT'))
    }

    async #saveTokenFromIol(token) {
        await userDao.editUser({
            user: "IOL",
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            accessTokenExpires: new Date(token['.expires']),
            refreshTokenExpires: new Date(token['.refreshexpires'])
        })
    }
}

const userService = new UserService()

module.exports = userService