const express = require('express');
const router = express.Router();
const otherQuotesService = require('../services/otherQuotesService');

router.get('/', async (req, res) => {
    const result = await otherQuotesService.getLastQuote()
    res.status(200).json(result)
})

router.post('/', async (req, res) => {
    const result = await otherQuotesService.uploadNewQuote(req.body)
    res.status(201).json(result)
})

module.exports = router