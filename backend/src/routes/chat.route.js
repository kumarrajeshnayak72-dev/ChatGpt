const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware')
const Controller = require('../controllers/chat.controller')

router.post('/',authMiddleware,Controller.userChat)

module.exports = router