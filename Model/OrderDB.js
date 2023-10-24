const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    products:[{type:mongoose.Schema.ObjectId,ref:'products'}],
    date: { type: String, default: new Date().toLocaleDateString() },
    time: { type: String, default: new Date().toLocaleTimeString() },
    order_id:String,
    payment_id:String,

})

module.exports = mongoose.model('orders',orderSchema)






