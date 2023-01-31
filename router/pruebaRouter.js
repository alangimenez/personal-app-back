const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log(req.body[0]);
    console.log(typeof(req.body))
})

router.post('/pm', async (req, res) => {
    console.log(req.body[1]);
    console.log(typeof(req.body))
})

module.exports = router