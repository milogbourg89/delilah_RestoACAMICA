const { Sequelize, Users } = require ("./conection")
const Op = Sequelize.Op 
async function createUser(user) {
    const userCreated = await Users.create(user)
    if(userCreated){
        return userCreated.id_usuario
    }else{
        throw new Error("El usuario no pudo ser creado")
    }
}

async function getRegisteredUser(user) {
    const { nombre_usuario, password } = user
    const userFound = await Users.findOne({ 
        where:{ 
            [Op.and]:[
                { nombre_usuario: nombre_usuario },
                { password: password }
            ]
         }
     })
     return userFound
}

async function getUser(username) {
    const userFound = await Users.findOne({
        where:{
            nombre_usuario: username
        },
        raw:true
    })
    return userFound
}

module.exports={createUser, getRegisteredUser, getUser}