const express = require('express')
const router = express.Router();
const authmiddleware = require('../middleware/auth.middleware')
const userChat = require('../controllers/chat.controller')

router.post('/',authmiddleware,userChat)

module.exports = router