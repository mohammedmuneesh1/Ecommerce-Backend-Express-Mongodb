
const dbConnection = require("../Model/databaseConnection");
const userDB = require("../Model/usersDB");
const productDB = require("../Model/productsDB");
const orderDB = require('../Model/OrderDB')
const jwt = require("jsonwebtoken");
const { response } = require("express");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
  userRegister: async (req, res) => {
    const { name, email, username, password } = req.body;

    if (!username || !password || !name || !email) {
      return res.status(400).json({
        status: "failure",
        message: "make sure you entered name,email,username,password",
      });
    }

    //check if username already exist on database userDB
    const Ucheck = await userDB.findOne({ username });
    if (Ucheck) {
      return res.status(409).json({
        message: "Username already taken. Please choose a different username",
      });
      //409 conflict [conflict due to username already in use]
    }

    await userDB.create({ username, password, email, name });
    // console.log(data)
    res
      .status(201)
      .json({ status: "success", message: "Registration successful!" });
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    const userCheck = await userDB.findOne({ username, password });
    if (!userCheck) {
      return res
        .status(404)
        .json({ status: "failure", message: "user not found on database" });
    }
    const token = jwt.sign({ username }, process.env.USER_ACCESS_TOKEN_SECRET);
    res.status(200).json({
      status: "success",
      message: "User successfully logged",
      jwt: token,
    });
  },
  products: async (req, res) => {
    const products = await productDB.find();
    res.status(200).json({
      status: "Success",
      message: "Successfully fetched products",
      products,
    });
  },
  productById: async (req, res) => {
    const id = req.params.id;
    const product = await productDB.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ status: "Failure", message: "Product not found on database." });
    }
    res.status(200).json({
      status: "Success",
      message: "Product found on database",
      product,
    });
  },

  productByCategory: async (req, res) => {
    const category = req.params.categoryname;

    // res.json({category})
    const result = await productDB.find({ category });
    res.json({
      status: "Success",
      message: "successfully fetched product by category",
      result,
    });
    // res.status(200).json({status:'success',message:"category found ",result})
  },
  addToCart: async (req, res) => {
    const userId = req.params.id;
    const checkuser = await userDB.findById(userId)
    if(!checkuser){return res.status(404).json({message:"User not found."})}

    const { productId } = req.body;
    if (!productId) {
      return res.json({
        status: "Failure",
        message: `make sure you entered productId:`,
      });
    }
    const chkItemExist = await userDB.findOne({ _id: userId, cart: productId });
    // console.log(chkItemExist)
    if (chkItemExist) {
      return res.status(409).json({
        message: "This product is already in your cart.",
      });
    }
    await userDB.updateOne({ _id: userId }, { $push: { cart: productId } });
    // const userWithCart = await userDB.findOne({_id:userId} );
    // console.log(userWithCart.cart);
    res
      .status(201)
      .json({
        status: "success",
        message: "Successfully added product to cart",
      });
    // res.status(201).json({status:'Success',message:'Successfully added product to cart',cart:userWithCart.cart})
  },

  showCart: async (req, res) => {
    const userId = req.params.id;
    const userCart = await userDB.findOne({ _id: userId }).populate("cart");
    if (!userCart) {
      return res.status(404).json({ error: "nothing to show on the cart" });
    }
    res.json({
      status: "Success",
      message: "Cart details retrieved successfully",
      data: userCart.cart,
    });
  },
  deleteCart:async(req,res)=>{
    const id = req.params.id
    const {productId} = req.body
    console.log(productId)
    //add id check not necessary
    if(!productId){ return res.json({message:"make sure you entered [ productId ]"})}

     await userDB.updateOne({_id:id},{$pull : {cart:productId}})
    res.status(200).json({status:"Success",message:"Successfully removed item from cart"})
  }
,
  wishList: async (req, res) => {
    const id = req.params.id;
    const { productId } = req.body;
    // console.log(id,productId)
    if (!productId) {
      return res.json({
        status: "Failure",
        message: `make sure you entered productId:`,
      });
    }
    //checking if product already exist in wish list
    const chkExist = await userDB.findOne({ _id: id, wishlist: productId });
    // console.log(chkExist);
    if (chkExist) {
      return res
        .status(409)
        .json({
          message: "You've already added this product to your wishlist.",
        });
    }
    await userDB.updateOne({ _id: id }, { $push: { wishlist: productId } });

    res
      .status(200)
      .json({ status: "success", message: "Successfully added to wishlist" });
  },


  showWishlist:async(req,res)=>{
    const id = req.params.id
    console.log(id)
    const products = await userDB.findOne({_id:id}).populate("wishlist")
    res.status(400).json({status:"Success",wishlist:products.wishlist})
  }
  ,
  deleteWishlist:async(req,res)=>{
    const id = req.params.id
    const {productId} = req.body
    if(!productId){
     return res.status(404).json({status:"failure",message:"make sure you entered [ productId ] "})
    }
    await userDB.updateOne({_id:id} , {$pull:{wishlist:productId}})
    res.status(200).json({status:"Successfully removed from wishlist",})
  },

  payment:async(req,res)=>{

    const id = req.params.id
    const qty = req.body
    const user = await userDB.find({_id:id}).populate('cart') //user with cart
    if(!user) { return res.status(404).json({message:"user not found "})}
    const cartItems = user[0].cart;
    if(cartItems.length === 0){ return res.status(400).json({message:"Your cart is empty"})}


    const lineItems = cartItems.map((item) => {
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.title,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100)   , // when item.price only given ,error occur, why ? check its reason . why multiply 100
        },
        quantity:1,
      };
    });
     //declaring session as global variable

     session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],     //, 'apple_pay', 'google_pay', 'alipay',card
      line_items: lineItems, 
      mode: 'payment',
      success_url: `http://localhost/api/users/${id}/payment/success`, // Replace with your success URL
      cancel_url: 'http://localhost/api/users/payment/cancel',   // Replace with your cancel URL
    });
    if(!session){
     return res.json({status:"Failure", message:" Error occured on  Session side"})

    }
    res.status(200).json({status:"Success",message:"Strip payment session created",url:session.url})
    // if(session){
    //    if(!order){
    //    return  res.json({status:"failure",message:'order not stored on order collection '})
    //    }
    //    return res.json({ status:"Success",message:"payment completed" , session_id:session.id,url:session.url})
    // }
    // res.json({message:"payment error"})


  },


  success:async(req,res)=>{
    // const id = req.params.id
    // console.log(id)
    // const user = await userDB.findOne({_id:id}) //find returns an array , findOne returns an object
    // const order = await orderDB.create({products:user.cart.map(value=>value.id) ,order_id:session.id,payment_id:session.payment_intent})
    res.send("success working ")
  },


  cancel:async (req,res)=>{
    res.send("cancel working ")
  }

};




