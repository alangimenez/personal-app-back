const express = require('express');
const router = express.Router();
const registerService = require('../services/registerService');

router.post('/', async (req, res) => {
    const result = await registerService.saveRegister(req.body)
    res.status(200).json(result)
})

router.get('/date', async (req, res) => {
    const result = await registerService.getLastTenRegisters(req.query.date);
    res.status(200).json(result)
})

router.get('/', async (req, res) => {
    const result = await registerService.getLastTenRegisters();
    res.status(200).json(result);
})

router.post('/status', async (req, res) => {
    const result = await registerService.changeRegisterStatus(req.body.id)
    res.status(200).json(result)
})

router.post('/batch', async (req, res) => {
    const result = await registerService.saveBatchRegisters(req.body)
    res.status(201).json(result)
})

router.post('/earning', async (req, res) => {
    const result = await registerService.saveEarning(req.body)
    res.status(201).json(result)
})

module.exports = router