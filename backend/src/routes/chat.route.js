const express = require('express');
const router = express();
const {authMiddleware} =  require('../middleware/auth.middleware')
const createChat =require('../controllers/chat.controller')

router.post('/',authMiddleware,createChat)


module.exports = router;