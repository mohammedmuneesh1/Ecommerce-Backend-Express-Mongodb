
const mongoose = require('mongoose')  //not necessary remove the line after final code 
const jwt = require('jsonwebtoken')
const dbConnection = require('../Model/databaseConnection')
const userDB = require('../Model/usersDB')
const productDB = require('../Model/productsDB')
module.exports={
    login:async(req,res)=>{
        const {username,password} = req.body
   

        if(username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD){
            //ADMIN OG U-NAME && U-PASSWORD IN .env
            const token =jwt.sign({username},process.env.ADMIN_ACCESS_TOKEN_SECRET)
            res.status(200).json({
                status:'success',
                message:'successfully logged',
                jwt_token:token
                //adding jwt pending data:{jwt_token:String}
            })

        }
        else{
           return res.status(404).json({message:"User not found"})
        }
        

    },
    viewUsers:async(req,res)=>{
        const data = await userDB.find()
        if(!data){
            return res.status(404).json({status:"failure",message:"not users found in the database."})
        }

        res.json({ status:"success",message:"successfully fetched user data.",data})
        // console.log(data)
        // console.log("view users ")
    },
    userById:async(req,res)=>{
        const id = req.params.id
        console.log(id)

        const user = await userDB.findById(id)
        
        // console.log(user)
        if(user.length == 0){ return res.status(404).json({status:"failure", message:"user not found "})}
        res.status(200).json({ status :"success",message:"successfully fetched user data.",data:user})

    },
    createProduct:async(req,res)=>{

        const {title,description,price,image,category}=req.body
        if(!title || !description || !price || !image || !category){
            return res.status(400).json({status:"failure",message:"missing required title, description, price, image, category"})
        }
        await productDB.create({title,description,price,image,category})
        res.status(201).json({status:"success",message:"successfully created a product"})
        

    },
    deleteProduct:async(req,res)=>{
         const {id} = req.body;
         const productDeleted = await productDB.findByIdAndRemove(id)
         console.log(productDeleted)
         if(!productDeleted){
            return res.status(404).json({status:"failure",message:"product not found on database"})
         }
         res.status(200).json({status:"success",message:"successfully deleted a product"})
    },

    allProduct:async(req,res)=>{
        const products = await productDB.find()
        if(!products){
            return res.status(404).json({status:"Failure",message:"No product found on database"})
        }
        res.status(200).json({status:"Success",message:"Successfully fetched products details",data:products})

    },
    productByCategory:async(req,res)=>{
       const type = req.query.type
       const data = await productDB.find({category : type})
       console.log(data)
       if(data.length == 0) { res.status(404).json({status:"failure",message:"Given Category not found on database."})}
       res.json({status:"Successfully fetched product details",message:"got value",data})

    },

    productById: async (req, res) => {
        const id = req.params.id;
        const product = await productDB.findById(id);
        if (!product ) {
          return res.status(404).json({
            status: "failure",
            message: "Product not found in the database"
          });
        }
        res.status(200).json({
          status: 'success',
          message: 'Successfully fetched product details',
          data: product
        });
      },

   



    updateProduct:async(req,res)=>{
        const {id,title,description,price,image,category} = req.body
        const datavailable = await productDB.findById(id)

        if(!datavailable){
            return res.status(404).json({status:"failure",message:"Product not found in the database. Check the product ID."})
        }
        const updatedProduct = await productDB.findByIdAndUpdate(
               { _id:id }
            ,
            {
                $set:{
                title,
                description,
                price,
                image,
                category
            }
        }
        );
        res.status(200).json({status:"success",message:'successfully update a product.'})





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

// [
//     {
//         "title": "Product 1",
//         "description": "This is the first demo product.",
//         "price": 19.99,
//         "image": "product1.jpg",
//         "category": "Electronics"
//     },
//     {
//         "title": "Product 2",
//         "description": "A sample description for the second product.",
//         "price": 29.99,
//         "image": "product2.jpg",
//         "category": "Clothing"
//     }
// ]