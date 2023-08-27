const fetch = require('node-fetch')

class CoinGeckoApiClient {
    constructor(){}

    async getEthereumQuoteByDate(date) {
        const ethereumResponse = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/history?date=${date}`)
        const ethereumData = await ethereumResponse.json()
        return ethereumData.market_data.current_price.usd
    }

    async getLitecoinQuoteByDate(date) {
        const litecoinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/litecoin/history?date=${date}`)
        const litecointData = await litecoinResponse.json()
        return litecointData.market_data.current_price.usd
    }

    async getBitcoinQuoteByDate(date) {
        const bitcoinResponse = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${date}`)
        const bitcointData = await bitcoinResponse.json()
        return bitcointData.market_data.current_price.usd
    }
}

const coinGeckoApiClient = new CoinGeckoApiClient()

module.exports = coinGeckoApiClient