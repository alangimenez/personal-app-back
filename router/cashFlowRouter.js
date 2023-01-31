const express = require('express');
const router = express.Router();
const { irr } = require('node-irr');
const cashFlowService = require('../services/cashFlowService');

router.get('/', async (req, res) => {

  /* data[0].cashFlow.unshift(-102.50)
  console.log(irr(data[0].cashFlow))
  
  function monthDiff(dateFrom, dateTo) { 
    return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear())) 
  }
  console.log(monthDiff(new Date(2022,09), new Date(2024, 05)))*/

  res.status(200).json(await cashFlowService.getCashFlow(req.body.bondName));
})

router.post('/', async (req, res) => {
  let result = await cashFlowService.saveCashFlow(req.body);
  if (result.bondName == req.body.bondName) {
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