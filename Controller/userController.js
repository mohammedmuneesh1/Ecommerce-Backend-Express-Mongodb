require("dotenv").config();
const dbConnection = require("../Model/databaseConnection");
const userDB = require("../Model/usersDB");
const productDB = require("../Model/productsDB");
const jwt = require("jsonwebtoken");

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
        status: "Success",
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
};
