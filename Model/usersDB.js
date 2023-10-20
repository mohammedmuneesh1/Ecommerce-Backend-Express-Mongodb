const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username:String,
    email:String,
    password:String,
    cart:[Object],
    wishlist:[Object],
    orders:[Object]
})
module.exports = mongoose.model('products',userSchema)

//populate concept 
// cart: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
// wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],