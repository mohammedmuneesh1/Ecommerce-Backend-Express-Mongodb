const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: String,
    username:String,
    email:String,
    password:String,
    cart:[{type:mongoose.Schema.ObjectId,ref:'products'}],
    wishlist:[{type:mongoose.Schema.ObjectId,ref:'products'}],
    orders:[{type:mongoose.Schema.ObjectId,ref:'orders'}]
})
module.exports = mongoose.model('users',userSchema)

//populate concept 
// cart: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
// wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],