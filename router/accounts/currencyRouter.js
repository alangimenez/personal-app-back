const express = require('express');
const router = express.Router();
const currencyService = require('../../services/accounts/currencyService');

router.get('/', async (req, res) => {
    const result = await currencyService.getListOfCurrencies();
    res.status(200).json(result);
})

router.post('/', async (req, res) => {
    const result = await currencyService.createNewCurrency(req.body)
    res.status(201).json(result)
})

module.exports = router