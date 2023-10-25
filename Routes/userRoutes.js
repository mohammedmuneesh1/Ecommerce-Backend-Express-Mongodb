const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')

//middleware 
const tryCatch = require('../Middleware/errorHandler')
const verifyToken = require('../Middleware/userAuthMiddleware')

router
.post('/register',tryCatch(userController.userRegister))
.post('/login',tryCatch(userController.login))

.use(verifyToken)
.get('/products',tryCatch(userController.products))
.get('/products/:id',tryCatch(userController.productById))
.get('/products/category/:categoryname',tryCatch(userController.productByCategory))
.post('/:id/cart',tryCatch(userController.addToCart))
.get('/:id/cart',tryCatch(userController.showCart))
.post('/:id/wishlist',tryCatch(userController.wishList))
.get('/:id/wishlist',tryCatch(userController.showWishlist))
.delete('/:id/cart',tryCatch(userController.deleteCart))
.delete('/:id/wishlist',tryCatch(userController.deleteWishlist))
.post('/:id/payment',userController.payment)
.get('/payment/success',userController.success)
.post('/payment/cancel',userController.cancel)
.get('/:id/orders',tryCatch(userController.showOrders))

module.exports=router



