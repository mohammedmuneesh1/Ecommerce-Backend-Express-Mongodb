const express = require('express')
const router = express.Router()
const controller = require('../Controller/adminController')

//middleware start
const tryCatch = require('../Middleware/errorHandler')
const verifyToken = require('../Middleware/authmiddleware')
//middleware end
router
.post('/login',tryCatch(controller.login))
.use(verifyToken)
.get('/users',tryCatch(controller.viewUsers))
.get('/users/:id',tryCatch(controller.userById))
.post('/products',tryCatch(controller.createProduct))
.delete('/products',tryCatch(controller.deleteProduct))
.get('/products',tryCatch(controller.allProduct))
.get('/products/:id',tryCatch(controller.productById))
.get('/products/category',tryCatch(controller.productByCategory))
.put('/products',tryCatch(controller.updateProduct))
.get('/orders',tryCatch(controller.orderDetails))
.get('/stats',tryCatch(controller.analysis))







module.exports=router