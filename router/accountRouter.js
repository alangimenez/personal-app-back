const express = require('express');
const router = express.Router();
const accountService = require('../services/accountService');

router.post('/', async (req, res) => {
    const result = await accountService.newAccount(req.body);
    res.status(200).json(result);
})

router.get('/', async (req, res) => {
    const result = await accountService.getAllAccounts();
    res.status(200).json(result);
})

router.get('/expenses', async (req, res) => {
    const result = await accountService.getExpenseAccounts();
    res.status(200).json(result)
})

router.get('/liquid', async (req, res) => {
    const result = await accountService.getLiquidAccounts();
    res.status(200).json(result)
})

router.get('/liquid-fci', async (req, res) => {
    const result = await accountService.getLiquidAndFciAccounts();
    res.status(200).json(result)
})

module.exports = router