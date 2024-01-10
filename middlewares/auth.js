const { SELLER } = require("../constants/role");

function checkAuthentication(req, res, next) {

  /* 
  todo: check log status from req.
  
  
  */

  let loggedIn = true;
  if (loggedIn) {
    req.role = "seller"
    if (req.role === SELLER) {
      req.user_id = "65709e8765e8659c61d7b125"
      next();
    } else {
      res.status(403).send({
        msg: "forbidden"
      })
    }
  } else {
    res.status(401).send({
      msg: "unauthenticated"
    })
  }
}

module.exports = {
  checkAuthentication
}