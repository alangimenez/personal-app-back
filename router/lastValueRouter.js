const express = require('express');
const router = express.Router();
const lastValueService = require('../services/lastValueService');

router.get('/', async (req, res) => {
    const datos = await lastValueService.getAll()
    res.status(200).json(datos)
})

router.get('/tir', async (req, res) => {
    const result = await lastValueService.getQuotesWithTir();
    res.json(result)
})

router.post('/', async (req, res) => {
    const result = await lastValueService.saveInfo(req.body.quotes);
    res.json(result)
})

module.exports = router