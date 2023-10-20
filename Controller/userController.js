require('dotenv').config()
const dbConnection = require('../Model/databaseConnection')
const userDB = require('../Model/usersDB')
// const jwt = require('jsonwebtoken')

module.exports = {
    userRegister:async(req,res)=>{
      const {name,email,username,password} = req.body
      if(!username || !password || !name || !email){ return res.status(400).json({message:"make sure you entered name,email,username,password"})}
      const data = await userDB.create({username,password,email,name})
      console.log(data)
      res.json({status:"success" , message:"Registration successful!"})
    },

    
}
