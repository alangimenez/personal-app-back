const express = require('express');
const router = express.Router();
const accountService = require('../services/accountService');

router.post('/', async (req, res) => {
    const result = await accountService.newAccount(req.body);
    res.status(200).json(result);
})

module.exports = router