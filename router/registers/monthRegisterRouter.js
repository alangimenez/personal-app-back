const express = require('express');
const router = express.Router();
const monthRegisterService = require('../../services/registers/monthRegisterService')

router.post('/', async (req, res) => {
    const result = await monthRegisterService.saveMonthRegister()
    res.status(201).json(result)
})

module.exports = router