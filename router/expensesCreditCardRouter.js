const express = require('express');
const router = express.Router();
const expenseCreditCardService = require('../services/expenseCreditCardService');

router.post('/', async (req, res) => {
    const result = await expenseCreditCardService
    res.status(200).json(result)
})

router.post('/period', async (req, res) => {
    const result = await expenseCreditCardService.createNewPeriod(req.body)
    res.status(201).json(result)
})

module.exports = router

// create endpoint for new period. After that, create endpoint for expenses