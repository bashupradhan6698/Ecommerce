const express = require("express");
const bcrypt = require("bcrypt")
const Joi = require('joi');

const User = require("./model/User")
const Product = require("./model/Product")
const { SELLER, BUYER } = require("./constants/role");
const { checkAuthentication } = require("./middlewares/auth");

const app = express();
require("./config/database")

app.use(express.json()) //global middleware 
/*
falsy values-  false, null, undefined , 0, "", NaN
*/

app.get("/api/products", async (req, res, next) => {
  try {
    let products = await Product.find()
    res.send(products)
  } catch (err) {
    next(err)
  }
})



const productCreateschema = Joi.object({
  name: Joi.string().required(),
  price: Joi.required(),
  description: Joi.string().required()
})

app.post("/api/products", checkAuthentication, async (req, res, next) => {
  try {
    let { error } = productCreateschema.validate(req.body,
      {
        abortEarly: false,
        stripUnknown: false,
        allowUnknown: true
      })
    console.log("errors", error?.details)

    if (error?.details) {
      res.status(400).send({
        errors: error?.details
      })
      return;
    }

    let product = await Product.create({ ...req.body, created_by: req.user_id })
    res.send(product)
  } catch (err) {
    next(err)
  }
})


const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  // password_confirmation: Joi.required().ref('password'),
})

app.post("/api/signup", async (req, res, next) => {
  // console.log(req.body); //undefined at first
  // let { name, email, role, password } = req.body //object destructuring
  try {

    let { error } = schema.validate(req.body,
      {
        abortEarly: false,
        stripUnknown: false,
        allowUnknown: true
      })

    console.log("errors", error?.details)

    if (error?.details) {
      res.status(400).send({
        errors: error?.details
      })
      return;
    }

    /* converting async hash to sych 
    saltrounds- 10 hashing complexity */
    let hashed = await bcrypt.hash(req.body.password, 10)

    let user = await User.create({ ...req.body, password: hashed })
    console.log(user);
    res.send(user)
  }

  catch (err) {
    next(err);

  }
})

const loginSchemaValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})

app.post("/api/login", async (req, res, next) => {
  /* 1. take email and password from req.body
  2. check if user exists
  3. check password  */
  try {
    let { error } = loginSchemaValidation.validate(req.body,
      {
        abortEarly: false,
        stripUnknown: false,
        allowUnknown: true
      })

    if (error?.details) {
      res.status(400).send({
        errors: error?.details
      })
      return;
    }

    let user = await User.findOne({ email: req.body.email }).select("+password")

    if (user) {
      console.log(user);
      let matched = await bcrypt.compare(req.body.password, user.password)
      if (matched) {
        res.send({
          msg: "login successful"
        })
        return;
      }

      res.status(401).send({
        msg: "Invalid credentials"
      })
    }



  } catch (err) {
    next(err);
  }
})

app.use((req, res) => {
  res.status(404).send({
    msg: "resource not found"
  })
})

app.use((err, req, res, next) => {
  let statuscode = 500;
  let message = "Server error";
  let errors = [];

  if (err.name == "ValidationError") {
    statuscode = 400;
    message: "Bad request"
    errors = Object.entries(err.errors).map(error => {
      return {
        params: error[0],
        msg: error[1].message
      }
    })
  }
  res.status(statuscode).send({
    msg: message + " " + err.message,
    errors
  })
})

app.listen(8000, () => {
  console.log("server started");
});


