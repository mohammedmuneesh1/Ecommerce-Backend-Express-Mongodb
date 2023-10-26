const joi = require('joi');
const joiUserRegisterSchema= joi.object({
  name: joi.string().required(),
  username: joi.string().alphanum().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const joiUserLoginSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().required()
})


const joiProductSchema = joi.object({
    productId:joi.string(),
    title: joi.string().required(),
    price: joi.number().min(1).positive().required(),
    image: joi.string().required(),
    description: joi.string().required(),
    category: joi.string().required()
});


module.exports={joiUserRegisterSchema, joiUserLoginSchema ,joiProductSchema }