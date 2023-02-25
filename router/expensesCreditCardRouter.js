const express = require('express');
const router = express.Router();
const expenseCreditCardService = require('../services/expenseCreditCardService');

router.post('/', async (req, res) => {
    const result = await expenseCreditCardService.saveExpenseInCreditCard(req.body)
    res.status(200).json(result)
})

router.post('/period', async (req, res) => {
    const result = await expenseCreditCardService.createNewPeriod(req.body)
    res.status(201).json(result)
})

router.post('/period/close', async (req, res) => {
    const result = await expenseCreditCardService.closeCreditCardPeriod()
    res.status(200).json(result)
})

router.get('/period', async (req, res) => {
    const result = await expenseCreditCardService.getOpenPeriodByCreditCard()
    res.status(200).json(result)
})

router.post('/period/status', async (req, res) => {
    const result = await expenseCreditCardService.changeStatusOfPeriod(req.body)
    res.status(200).json(result)
})

module.exports = router