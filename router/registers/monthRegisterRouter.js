const express = require('express');
const router = express.Router();
const monthRegisterService = require('../../services/registers/monthRegisterService')

router.get('/', async (req, res) => {
    const result = await monthRegisterService.saveEarning(req.body)
    res.status(201).json(result)
})

module.exports = router