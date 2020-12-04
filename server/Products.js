const { Router } = require ("express")
const router = Router()
const { authenticateUser, isAdmin } = require("./auth")
const { getProducts, getProductById , createProduct, updateProduct, deleteProduct } = require("../database/pQuerys")

router.use(authenticateUser)


router.get("/",async function( req, res){
    const { userLoged } = req.usuario
    try {
        const products = await getProducts()
        return res.status(200).send(products)
    } catch (error) {
        res.status(500).send("internal server error")
    }
})

router.get("/:id", async function (req, res){
    try {
        const id_product = req.params.id 
        const productFound = await getProductById(id_product)
        res.status(200).send(productFound)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post("/", isAdmin,async function (req, res){
    try {
        const newProduct = req.body
        const createdProduct = await createProduct(newProduct)
        res.status(201).json({
            id_plato: createdProduct.id_plato
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.put("/:id", isAdmin,async function (req, res){
    const idProduct = req.params.id
    const data = req.body
    try {
        const updated = await updateProduct( data, idProduct)
        res.status(200).send("producto actualizado satisfactoriamente")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.delete("/:id", isAdmin,async function (req, res){
    const idProduct = req.params.id
    try {
        const deleted = await deleteProduct(idProduct)
        if(deleted==1){
            res.status(200).send("Producto eliminado satisfactoriamente")
        } else{
            throw new Error("El producto no se pudo eliminar")
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router