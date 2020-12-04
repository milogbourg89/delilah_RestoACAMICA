const {Sequelize, Orders, PxOrders, Products} = require("./conection")
const { getIdOfProducts, getProductsPrice, finalPrice } = require("../utils/functions")
const { getProductsById } = require ("./pQuerys")
const { getUser } = require("./uQuerys")
const Moment = require("moment")
const moment = Moment() 


async function createOrder(neworder, username){
    const idProducts = getIdOfProducts(neworder.products)
    try {
        const orderProducts = await getProductsById(idProducts)
        const newPrice = getProductsPrice(orderProducts, neworder.products)
        const totalprice = finalPrice(newPrice)
        const user = await getUser(username)
        const orderdate = moment.format("YYYY-MM-DD HH:mm:ss")
        const order = { 
            precio_total:totalprice,
            estado_pedido:"nuevo",
            metodo_pago:neworder.metodo_pago,
            direccion:user.direccion,
            id_usuario_pedido:user.id_usuario,
            fecha_pedido:orderdate
         }
        const orderCreated = await insertOrder(order)
        const idOrder = orderCreated.id_pedido 
        const registerCreated = insertPxO(idOrder, neworder.products)
        return orderCreated
    } catch (error) {
        console.log(error)
        throw new Error ("no se pudo crear el pedido")
    }
}

async function insertOrder(order) {
    try {
        const orderCreated = await Orders.create(order)
        return orderCreated
    } catch (error) {
        throw new Error ("no se pudo insertar el pedido")
    }
}

function insertPxO(id, array) {
    const register = array.map(element => {
        const id_plato = element.id_plato
        const cantidad = element.cantidad
        const object = { 
            id_plato:id_plato,
            id_pedido:id,
            cantidad:cantidad,
        }
        return object
    })
    try {
        PxOrders.bulkCreate(register)
    } catch (error) {
        console.log(error)
    }
    

    return register
}

async function getAllOrders () {
    const ordersFound = await Orders.findAll({
        include:[{
            model: Products,
            through: {
                as:"PxO",
                attributes: ["cantidad"]
            }
        }]
    })
    return ordersFound
}

async function getUserOrders (username) {
    const user = await getUser(username)
    const userId = user.id_usuario
    const userOrder = await Orders.findAll({
        include:[{
            model: Products,
            through: {
                as:"PxO",
                attributes: ["cantidad"]
            }
        }],
        where: { id_usuario_pedido: userId } 
    })
    return userOrder
}

async function updateOrder (idOrder, data) {
    const updated = await Orders.update(data, {
        where: { id_pedido:idOrder }
    }) 
    return updated
}

async function deleteOrder (id) {
    const registerDeleted = await PxOrders.destroy({
        where: { id_pedido:id }
    })
    if (registerDeleted !=0) {
        const deleted = await Orders.destroy( {
            where: { id_pedido:id }
        })
        return deleted
    }else {
        throw new Error (`no pudo eliminarse el pedido con id ${id} `)
    }
}

module.exports = { createOrder, getAllOrders, getUserOrders, updateOrder, deleteOrder }
