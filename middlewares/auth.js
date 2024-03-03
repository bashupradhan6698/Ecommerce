const jwt = require('jsonwebtoken')
const { SELLER, BUYER } = require("../constants/role");

function checkAuthentication(req, res, next) {
  // console.log(req.headers);
  let token = req.headers?.authorization?.split(" ")[1]
  let user = null;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET); //decoded token in user
    // console.log("user-updated", user);
  }
  catch (err) {

  }

  if (user) {
    req.user = user; //to access the value of req.user in next function
    next();
  } else {
    res.status(401).send({
      msg: "unauthenticated"
    })
  }
}

const isBuyer = (req, res, next) => {
  if (req.user.role === BUYER) {
    next();
  } else {
    res.status(403).send({
      msg: "forbidden"
    })
  }
}

const isSeller = (req, res, next) => {

  if (req.user.role === SELLER) {
    next();
  } else {
    res.status(403).send({
      msg: "forbidden"
    })
  }
}

module.exports = {
  checkAuthentication,
  isBuyer,
  isSeller
}