const express = require("express");


const product_routes = require("./routes/product")
const auth_routes = require("./routes/auth");

const { handleResourceNotFound, handleServerError } = require("./middlewares/error");

require("./config/database")

const app = express();
app.use(express.json()) //global middleware 


app.use(auth_routes)
app.use("/api/products", product_routes)


app.use(handleResourceNotFound)

app.use(handleServerError);



app.listen(8000, () => {
  console.log("server started");
});


