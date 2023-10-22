require('dotenv').config()
const dbConnection = require('../Model/databaseConnection')
const userDB = require('../Model/usersDB')
// const jwt = require('jsonwebtoken')

module.exports = {
    userRegister:async(req,res)=>{
      const {name,email,username,password} = req.body
      if(!username || !password || !name || !email){ return res.status(400).json({status:"failure",message:"make sure you entered name,email,username,password"})}
      const data = await userDB.create({username,password,email,name})
      console.log(data)
      res.json({status:"success" , message:"Registration successful!"})
    },

    login:async(req,res)=>{
      const {username,password} = req.body
      const userCheck = await userDB.find({username,password})
    if(!userCheck){
       return res.status(404).json({status:'failure',message:"user not found on database"})
    }
    const token =jwt.sign({username},process.env.USER_ACCESS_TOKEN_SECRET)
    res.status(200).json({status:'success',message:"User successfully logged",jwt:token})
    }


    
}
