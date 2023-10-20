require('dotenv').config()
const dbConnection = require('../Model/databaseConnection')
const userDB = require('../Model/usersDB')
const productDB = require('../Model/productsDB')
module.exports={
    login:async(req,res)=>{
        const {username,password} = req.body
   

        if(username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD){
            //ADMIN OG U-NAME && U-PASSWORD IN .env
            res.status(200).json({
                status:'success',
                message:'successfully logged',
                //adding jwt pending data:{jwt_token:String}
            })

        }
        else{
           return res.status(404).json({message:"User not found"})
        }
        

    },
    viewUsers:async(req,res)=>{
        res.json("viewusers pending")
    },
    userByDetails:async(req,res)=>{
        res.json("userbydetails pending")

    },
    viewallproductbycategory:async(req,res)=>{
        res.json("productbycategory pending")

    },
    viewspecificproduct:async(req,res)=>{
        res.json("specific product  pending")

    },
    createaproduct:async(req,res)=>{
        res.json("create-product pending")

    },
    deleteproduct:async(req,res)=>{
        res.json("deleteproduct pending")

    },
    updateproduct:async(req,res)=>{
        res.json("updateproduct pending")

    },
    totalproductpurchased:async(req,res)=>{
        res.json("totalproductpurchased pending")

    },
    totalrevenuegenerated:async(req,res)=>{
        res.json("totalrevenuegenerated pending")

    },
    orderdetails:async(req,res)=>{
        res.json("orderdetails pending")

    },

}

