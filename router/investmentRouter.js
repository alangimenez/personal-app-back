const express = require('express');
const router = express.Router();
const investmentService = require('../services/investmentService');

router.post('/', async (req, res) => {
    const result = await investmentService.saveInvestment(req.body);
    console.log(result)
    res.status(201).json(result)
})

router.get('/', async (req, res) => {
    const result = await investmentService.getInvestments();
    res.status(200).json(result)
})

router.get('/portfolio', async (req, res) => {
    const result = await investmentService.getPortfolio()
    res.status(200).json(result)
})

/* router.post('/investment', async (req, res) => {
    const resul = await investmentService
}) */

module.exports = router;