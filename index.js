const express = require("express")
const app = express()
const body_parser = require("body-parser")
const cors = require("cors")
const user = require("./server/user")
const products = require("./server/Products")
const orders = require("./server/order")

app.use(body_parser.json(), cors())
app.use("/users",user)
app.use("/products", products )
app.use("/orders", orders)

app.listen("3000",function(){
    console.log("servidor funcionando")
})