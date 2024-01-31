const express = require("express")
const { fetchTodos } = require("../controller/todo")
const router = express.Router()



router.get("", fetchTodos)

router.post("", (req, res) => {
  res.send("data")
})


module.exports = router;
