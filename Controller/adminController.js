const jwt = require("jsonwebtoken");
const userDB = require("../Model/usersDB");
const productDB = require("../Model/productsDB");
const OrderDB = require("../Model/OrderDB");
const { joiProductSchema } = require("../Model/validateJoiSchema");

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { username },
        process.env.ADMIN_ACCESS_TOKEN_SECRET
      );
      res.status(200).json({
        status: "success",
        message: "successfully logged",
        jwt_token: token,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  },
  viewUsers: async (req, res) => {
    const data = await userDB.find();
    if (!data) {
      return res.status(404).json({
        status: "failure",
        message: "not users found in the database.",
      });
    }

    res.json({
      status: "success",
      message: "successfully fetched user data.",
      data,
    });
    // console.log(data)
    // console.log("view users ")
  },
  userById: async (req, res) => {
    const id = req.params.id;
    console.log(id);

    const user = await userDB.findById(id);

    // console.log(user)
    if (user.length == 0) {
      return res
        .status(404)
        .json({ status: "failure", message: "user not found " });
    }
    res.status(200).json({
      status: "success",
      message: "successfully fetched user data.",
      data: user,
    });
  },

  createProduct: async (req, res) => {
    const { value, error } = joiProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    
    const { title, description, price, image, category } = value;

    await productDB.create({ title, description, price, image, category });
    res
      .status(201)
      .json({ status: "success", message: "successfully created a product" });
  },

  deleteProduct: async (req, res) => {
    const { id } = req.body;
    const productDeleted = await productDB.findByIdAndRemove(id);
    console.log(productDeleted);
    if (!productDeleted) {
      return res
        .status(404)
        .json({ status: "failure", message: "product not found on database" });
    }
    res
      .status(200)
      .json({ status: "success", message: "successfully deleted a product" });
  },

  allProduct: async (req, res) => {
    const products = await productDB.find();
    if (!products) {
      return res
        .status(404)
        .json({ status: "Failure", message: "No product found on database" });
    }
    res.status(200).json({
      status: "Success",
      message: "Successfully fetched products details",
      data: products,
    });
  },
  productByCategory: async (req, res) => {
    const type = req.query.type;
    const data = await productDB.find({ category: type });
    console.log(data);
    if (data.length == 0) {
      res.status(404).json({
        status: "failure",
        message: "Given Category not found on database.",
      });
    }
    res.json({
      status: "Successfully fetched product details",
      message: "got value",
      data,
    });
  },

  productById: async (req, res) => {
    const id = req.params.id;
    const product = await productDB.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "failure",
        message: "Product not found in the database",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched product details",
      data: product,
    });
  },

  updateProduct: async (req, res) => {
    const { value, error } = joiProductSchema.validate(req.body);
    if (error) {
      return res.status(401).json({ message: error.details[0].message });
    }

    const { productId, title, description, price, image, category } = value;
    const pIdCheck = await productDB.findById(productId); //checking product by its id if product exist
    if (!pIdCheck) {
      return res.status(404).json({
        status: "failure",
        message: "Product not found in the database. Check the product Id.",
      });
    }
    await productDB.findByIdAndUpdate(
      { _id: productId },
      {
        $set: {
          title,
          description,
          price,
          image,
          category,
        },
      }
    );
    res
      .status(200)
      .json({ status: "success", message: "successfully update a product." });
  },

  orderDetails: async (req, res) => {
    const order = await OrderDB.find();
    console.log(order);
    if (order.length === 0) {
      return res
        .status(204)
        .json({ status: "Success", message: "No content available." });
    }
    res.status(200).json({
      status: "Success",
      message: "Successfully fetched order details",
      order,
    });
  },

  analysis: async (req, res) => {
    const order = await OrderDB.find();

    //METHOD-1-MEDIUM
    const data = await OrderDB.aggregate([
      {
        $group: {
          _id: null,
          totalProductPurchased: { $sum: { $size: "$products" } },
          revenue: { $sum: "$total_amount" },
        },
      },
      { $project: { _id: 0 } },
    ]);

    //method-2-EASY
    //  let totalProducts = 0;
    // let revenue = 0;
    // for(value of order){
    //   totalProducts +=value.products.length;
    //   revenue += value.total_amount;
    // }
    // res.json({status:"Success",message:"working",totalProductsPurchased:totalProducts,revenue})

    res.json({ data });
  },
  trail:async(req,res)=>{
    const imagePath = req.file.path;  // Store the file path example :  "uploads\\1698479563658.png"
    res.json({message:"working",imagePath})
  }
};
