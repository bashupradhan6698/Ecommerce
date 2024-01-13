const express = require("express");
const { signUP, logIn } = require("../controller/auth");

const router = express.Router();




router.post("/api/signup", signUP)
router.post("/api/login", logIn)

module.exports = router