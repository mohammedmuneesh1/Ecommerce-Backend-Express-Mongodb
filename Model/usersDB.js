const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    name: String,
    email:String,
    password:String,
    cart:[{type:mongoose.Schema.ObjectId,ref:'products'}],
    wishlist:[{type:mongoose.Schema.ObjectId,ref:'products'}],
    orders:[{type:mongoose.Schema.ObjectId,ref:'orders'}]
})

userSchema.pre("save",async function (next){
     const user = this;
     if(!user.isModified('password')) { return next()}
     const salt =await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(user.password,salt)
     user.password = hashedPassword
    //  console.log("this is salt" ,salt)
     next()
})


module.exports = mongoose.model('users',userSchema)






//populate concept 
// cart: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
// wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],