const express = require('express');
const router = express.Router();
const mercadoPagoService = require('../services/mercadoPagoService')

router.post('/', async (req, res) => {
    const result = await mercadoPagoService.createNewPeriod(req.body)
    res.status(200).json(result)
})

module.exports = router