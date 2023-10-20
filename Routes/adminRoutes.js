const express = require('express')
const router = express.Router()
const controller = require('../Controller/adminController')
//middleware start
const tryCatch = require('../Middleware/errorHandler')
//middleware end
router
.get('/login',tryCatch(controller.login))

module.exports=router