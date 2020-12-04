const { Router } = require("express")
const router = Router()
const {createUser} = require ("../database/uQuerys")
const {validateUser, authenticateUser} = require ("./auth")
const { getUserOrders } = require ("../database/oQuerys")


router.post("/register",async function( req, res) {
    const newUser = req.body
     
    try {
        const created = await createUser(newUser)
        res.status(201).send(`usuario creado satisfactoriamente id:${created}`)
    } catch (error) {
        res.status(400).send(`ocurrio un error: ${error.message}`)
    }
})

router.post("/login", async function( req, res){
    const userLogIn = req.body 
    const [userLoged, token ] = await validateUser(userLogIn)
    if( !userLoged) {
        return res.status(400).send("usuario y/o contraseña incorrecta")
    } res.status(200).json({
        msg: `Bienvenido! ${userLoged}`,
        token: token
    })
})

router.get("/orders",authenticateUser ,async function (req, res){
    const username = req.usuario.userLoged
    
    try {
        const ordersfound = await getUserOrders(username)
        if(ordersfound.length != 0){
            res.status(200).send(ordersfound)
        }else {
            res.status(404).send("no se encontraron pedidos disponibles")
        }
    } catch (error) {
        res.status(500).send("error de sistema")
    }
    
})


module.exports=router
