const express = require('express');
const router = express.Router();
const expenseService = require('../services/expensesService');

router.post('/', async (req, res) => {
    const result = await expenseService.saveExpense(req.body)
    res.status(200).json(result)
})

router.get('/date', async (req, res) => {
    const result = await expenseService.getExpenseFilterByDate(req.query.date);
    res.status(200).json(result)
})

router.get('/', async (req, res) => {
    const result = await expenseService.getLastTenExpenses();
    res.status(200).json(result);
})

router.post('/status', async (req, res) => {
    const result = await expenseService.changeExpenseStatus(req.body.id)
    res.status(200).json(result)
})

router.post('/batch', async (req, res) => {
    const result = await expenseService.saveBatchExpenses(req.body)
    res.status(200).json(result)
})

module.exports = router