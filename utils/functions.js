function getIdOfProducts(array){
    let idsArray = []
    array.forEach(element => {
        const id = element.id_plato
        idsArray.push(id)
    });
    return idsArray
}

function getProductsPrice(arrayp, arrayc){
    let newarray = []
    for (let i = 0; i < arrayp.length; i++) {
        const product = arrayp[i]
        const price = product.precio_plato
        const cantidad = arrayc.find(element=> element.id_plato == product.id_plato).cantidad
        const newprice = price * cantidad 
        newarray.push(newprice)
    }
    return newarray
}

function finalPrice(arrayfp) {
    let total = 0
    arrayfp.forEach( price => {
        total += price
    });
    return total
}

module.exports = { getIdOfProducts, getProductsPrice, finalPrice}