const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')

//middleware 
const tryCatch = require('../Middleware/errorHandler')
const verifyToken = require('../Middleware/userAuthMiddleware')
router
.post('/register',tryCatch(userController.userRegister))















module.exports=router
