const express = require('express');
const router = express.Router();
const cashFlowService = require('../services/cashFlowService');

router.get('/', async (req, res) => {
  res.status(200).json(await cashFlowService.getCashFlow());
})

router.post('/', async (req, res) => {
  let result = await cashFlowService.saveCashFlow(req.body);
  if (result.ticket == req.body.ticket) {
    res.status(201).json({ "message": "ok" })
  } else {
    res.status(500).json({ "message": "error" })
  }

})

router.get('/flow', async (req, res) => {
  let result = await cashFlowService.getAllCashFlowSorted()
  res.status(200).json(result)
})

module.exports = router