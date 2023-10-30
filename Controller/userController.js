const dbConnection = require("../Model/databaseConnection");
const userDB = require("../Model/usersDB");
const productDB = require("../Model/productsDB");
const orderDB = require("../Model/OrderDB");
const jwt = require("jsonwebtoken");
const {
  joiUserRegisterSchema,
  joiUserLoginSchema,
} = require("../Model/validateJoiSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const mongoose = require("mongoose");
const usersDB = require("../Model/usersDB");
const bcrypt = require("bcrypt");
//global variable start
let sValue = {};

//global variable end

module.exports = {
  userRegister: async (req, res) => {
    const { value, error } = joiUserRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email,password } = value;


    const uEmailCheck = await userDB.findOne({ email });

       if (uEmailCheck){return res.status(409).json({message:"Already registered with this email. Provide new Email"})}
    
     

    // PASSWORD HASHING WITHOUT PRE SAVE MIDDLEWARE
    // const salt =await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password,salt)
    // await userDB.create({ username, password:hashedPassword, email, name });

    await userDB.create({password, email, name });
    res
      .status(201)
      .json({ status: "success", message: "Registration successful!" });
  },

  login: async (req, res) => {
    const { value, error } = joiUserLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = value;
    const user = await userDB.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "failure", message: "user not found on database" });
    }
    const passCheck = bcrypt.compare(password, user.password);
    if (!passCheck) {
      return res
        .status(401)
        .json({ status: "Failure", message: "Incorrect Password" });
    }
    const token = jwt.sign({ email }, process.env.USER_ACCESS_TOKEN_SECRET);
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
    const checkuser = await userDB.findById(userId);
    if (!checkuser) {
      return res.status(404).json({ message: "User not found." });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.json({
        status: "Failure",
        message: `make sure you entered productId:`,
      });
    }

    await userDB.updateOne({ _id: userId }, { $addToSet: { cart: productId } });

    // const userWithCart = await userDB.findOne({_id:userId} );
    // console.log(userWithCart.cart);
    res.status(201).json({
      status: "success",
      message: "Successfully added product to cart",
    });
    // res.status(201).json({status:'Success',message:'Successfully added product to cart',cart:userWithCart.cart})
  },

  showCart: async (req, res) => {
    const userId = req.params.id;
    const user = await userDB.findOne({ _id: userId }).populate("cart");
    if (!user) {
      return res.status(404).json({ error: "nothing to show on the cart" });
    }
    if (user.cart.length === 0) {
      return res.json({
        message: "you have nothing on cart. add some products",
      });
    }
    res.json({
      status: "Success",
      message: "Cart details retrieved successfully",
      data: user.cart,
    });
  },

  deleteCart: async (req, res) => {
    const id = req.params.id;
    const { productId } = req.body;
    console.log(productId);
    //add id check not necessary
    if (!productId) {
      return res.json({ message: "make sure you entered [ productId ]" });
    }

    await userDB.updateOne({ _id: id }, { $pull: { cart: productId } });
    res.status(200).json({
      status: "Success",
      message: "Successfully removed item from cart",
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
      return res.status(409).json({
        message: "You've already added this product to your wishlist.",
      });
    }
    await userDB.updateOne({ _id: id }, { $push: { wishlist: productId } });

    res
      .status(200)
      .json({ status: "success", message: "Successfully added to wishlist" });
  },

  showWishlist: async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const products = await userDB.findOne({ _id: id }).populate("wishlist");
    res.status(400).json({ status: "Success", wishlist: products.wishlist });
  },
  deleteWishlist: async (req, res) => {
    const id = req.params.id;
    const { productId } = req.body;
    if (!productId) {
      return res.status(404).json({
        status: "failure",
        message: "make sure you entered [ productId ] ",
      });
    }
    await userDB.updateOne({ _id: id }, { $pull: { wishlist: productId } });
    res.status(200).json({ status: "Successfully removed from wishlist" });
  },

  payment: async (req, res) => {
    const id = req.params.id;
    uid = id; //for passing as global variable
    const user = await userDB.findOne({ _id: id }).populate("cart"); //user with cart
    if (!user) {
      return res.status(404).json({ message: "user not found " });
    }
    const cartItems = user.cart;
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const lineItems = cartItems.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.title,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100), // when item.price only given ,error occur, why ? check its reason . why multiply 100
        },
        quantity: 1,
      };
    });
    //declaring session as global variable

    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], //, 'apple_pay', 'google_pay', 'alipay',card
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:3000/api/users/payment/success`, // Replace with your success URL
      cancel_url: "http://localhost:3000/api/users/payment/cancel", // Replace with your cancel URL
    });

    if (!session) {
      return res.json({
        status: "Failure",
        message: " Error occured on  Session side",
      });
    }
    sValue = {
      //values to be sent to success function
      id,
      user,
      session,
    };

    res.status(200).json({
      status: "Success",
      message: "Strip payment session created",
      url: session.url,
    });
  },

  success: async (req, res) => {
    const { id, user, session } = sValue;
    const cartItems = user.cart;

    // const paymentId = session.payment_intent; //payment_intent showing null
    // console.log(paymentId)

    const order = await orderDB.create({
      userid: id,
      products: cartItems.map(
        (value) => new mongoose.Types.ObjectId(value._id)
      ), // we get product id in the cart
      order_id: session.id,
      payment_id: `demo ${Date.now()}`,
      total_amount: session.amount_total / 100,
    });

    if (!order) {
      return res.json({ message: "error occured while inputing to orderDB" });
    }

    const orderId = order._id;
    // console.log(orderId)

    const updateUser = await userDB.updateOne(
      { _id: id },
      {
        $push: { orders: orderId },
        $set: { cart: [] },
      }
    );
    // console.log(updateUser); checking for acknowledgement
    res.status(200).json({
      status: "Success",
      message: "Payment Successful.",
    });
  },

  cancel: async (req, res) => {
    res.status(200).json({
      status: "Success",
      message: "Payment cancelled.",
    });
  },

  showOrders: async (req, res) => {
    //code need changes
    const id = req.params.id;
    const user = await userDB.findById(id).populate("orders");
    if (!user) {
      return res
        .status(404)
        .json({ status: "Failure", message: "User not found." });
    }
    const uOrder = user.orders; //userOrder
    // console.log(uOderId)
    // console.log(uOrder)
    if (!uOrder || uOrder.length === 0) {
      return res.status(200).json({ message: "you have no orders to show" });
    }
    const orderProductDetails = await orderDB
      .find({ _id: { $in: uOrder } })
      .populate("products");
    //[{id},{id}] for accessing id inside array with many object use $in ***IMP***
    res.status(200).json({
      status: "Success.",
      message: "Fetched Order Details",
      orderProductDetails,
    });
  },
};
