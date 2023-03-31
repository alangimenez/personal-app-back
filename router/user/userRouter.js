const express = require('express');
const router = express.Router();
const userService = require('../../services/user/userService');

router.post('/login', async (req, res) => {
    const result = await userService.loginUser(req.body);
    res.status(200).json(result);
})

router.post('/register', async (req, res) => {
    const result = await userService.registerNewUser(req.body)
    res.status(201).json(result)
})

module.exports = router