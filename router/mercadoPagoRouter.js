const express = require('express');
const router = express.Router();
const mercadoPagoService = require('../services/mercadoPagoService');
const logService = require('../services/logs/logService')

router.get('/', async (req, res) => {
    const result = await mercadoPagoService
    res.status(200).json(result)
})

router.post('/', async (req, res) => {
    const result = await mercadoPagoService.createNewPeriod(req.body)
    res.status(201).json(result)
})

router.get('/last', async (req, res) => {
    const result = await mercadoPagoService.getLastPeriod()
    res.status(200).json(result)
})

router.post('/batch', async (req, res) => {
    const result = await mercadoPagoService.uploadBatchExpense(req.body)
    res.status(201).json(result)
})

module.exports = router