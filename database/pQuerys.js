const { Sequelize, Products } = require ("./conection")
async function getProducts(){
    try {
        const listProduct = await Products.findAll()
        return listProduct
    } catch (error) {
        throw new Error(error.message)
    }
}

async function getProductById(id) {
    const product = await Products.findOne({ 
        where:{
            id_plato:id
        }
     })
    if(!product) {
        throw new Error(`producto con id: ${id}, inexistente`)
    }
    return product
}

async function getProductsById(array) {
    const products = await Products.findAll({
        where:{
            id_plato:array
        },
        raw: true,
        rejectOnEmpty: true
    })
    if(products.lenght < array.length){
        throw new Error("error, revisar id de los platos")
    }
    return products

}

async function createProduct(product) {
    let newProduct
    try {
        newProduct = await Products.create(product)
    } catch (error) {
        throw new Error("El producto no pudo ser creado. Verificar datos")
    }
    return newProduct
}

async function updateProduct( data, id) {
    let updatedProduct
    try {
        updatedProduct = await Products.update(data, {
            where: {
                id_plato:id
            }
        })
        return updatedProduct
    } catch (error) {
        throw new Error("El producto no pudo ser modificado. Verificar datos")
    }
}

async function deleteProduct(id) {
    let deletedProduct
    try {
        deletedProduct = await Products.destroy( {
            where: {
                id_plato:id
            }
        })
        return deletedProduct
    } catch (error) {
        throw new Error(`El producto con id: ${id}, no pudo ser eliminado`)
    }
}

module.exports = { getProducts , getProductById , createProduct, updateProduct, deleteProduct, getProductsById}