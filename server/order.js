const {Router} = require("express")
const router = Router()
const { authenticateUser, isAdmin } = require("./auth")
const { createOrder, getAllOrders, updateOrder, deleteOrder} = require("../database/oQuerys")

router.use(authenticateUser)

router.post("/", async function (req, res){
    const order = req.body
    const { userLoged } = req.usuario
    try {
        const orderCreated = await createOrder(order, userLoged)
        res.status(201).send(orderCreated)

    } catch (error) {
        res.status(400).json({
            msg:"no se pudo realizar el pedido",
            error:error.message
        })
    }
})

router.get("/", isAdmin ,async function (req, res){
    try {
        const orders = await getAllOrders()
        if(orders.length != 0){
            res.status(200).send(orders)
        }else {
            res.status(404).send("no se encontraron pedidos disponibles")
        }
    } catch (error) {
        res.status(500).send("error de sistema")
    }
})

router.put("/:id", isAdmin, async function (req, res){
    const updateData =  req.body 
    const idOrder = req.params.id 
    
    try {
        const updated = await updateOrder(idOrder, updateData)
        if(updated){
            res.status(200).send(`pedido con id${idOrder} modificado con éxito`)
        }else {
            res.status(400).send("No se pudo modificar el pedido. verificar id")
        }
    } catch (error) {
        res.status(500).send("error de sistema")
    }
})

router.delete("/:id", isAdmin, async function(req, res){
    const idOrder = req.params.id
    try {
        const deleted = await deleteOrder(idOrder)
        if(deleted){
            res.status(200).send(`pedido con id ${idOrder} eliminado con éxito`)
        }else{
            res.status(400).send("No se pudo eliminar el pedido, verificar id")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("error de sistema")
    }
})

module.exports = router