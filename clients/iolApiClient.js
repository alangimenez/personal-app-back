const fetch = require('node-fetch')
const { IOL_USER, IOL_PASSWORD } = require('../config/config.environments')

class IolApiClient{
    constructor(){}

    async getOnQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/Cotizaciones/obligacionesNegociables/argentina/Todos`, requestOptions)
        return await quotesResponse.json() 
    }

    async getAdrQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/Cotizaciones/aDRs/estados_Unidos/Todos`, requestOptions)
        return await quotesResponse.json() 
    }

    async getPublicBondsQuotes(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        }
        const quotesResponse = await fetch(`https://api.invertironline.com/api/v2/Cotizaciones/bonos/bCBA/argentina`, requestOptions)
        return await quotesResponse.json() 
    }

    async getRefreshTokenFromIol(refreshToken) {
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
        return await tokenResponse.json()
    }

    async getAccessTokenFromIol() {
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
        return await tokenResponse.json()
    }
}

const iolApiClient = new IolApiClient()

module.exports = iolApiClient