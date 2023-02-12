const express = require('express');
const router = express.Router();
const assetTypeService = require('../services/assetTypeService');

router.get('/', async (req, res) => {
    const result = await assetTypeService.getAllAssetType()
    res.status(200).json(result)
})

router.post('/', async (req, res) => {
    const result = await assetTypeService.createAssetType(req.body)
    res.status(201).json(result)
})

router.post('/associate', async (req, res) => {
    const result = await assetTypeService.associateTicketWithAssetType(req.body)
    res.status(201).json(result)
})

module.exports = router