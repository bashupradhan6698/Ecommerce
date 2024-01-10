const express = require("express")
const Joi = require("joi")
const bcrypt = require("bcrypt")

const User = require("../model/User")

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8)
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  // password_confirmation: Joi.required().ref('password'),
})

router.post("/api/signup", async (req, res, next) => {
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

router.post("/api/login", async (req, res, next) => {
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

module.exports = router