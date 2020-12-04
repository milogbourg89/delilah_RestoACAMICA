const jwt = require("jsonwebtoken")
const jwtSignature = "acamicadelila"
const { getRegisteredUser, getUser } = require("../database/uQuerys")


async function validateUser(user) {
    const validateUser = await getRegisteredUser(user)
    if( !validateUser) {
        return [null]
    }
    const userLoged = validateUser.nombre_usuario 
    const token = jwt.sign({
        userLoged
    }, jwtSignature)
    return [userLoged, token]
}

async function authenticateUser(req, res, next) {
    try {
        const token = req.headers.authorization
        console.log(req.headers)
        const authenticated = jwt.verify(token, jwtSignature)
        if(authenticated) {
            req.usuario = authenticated
            return next()
        }
    } catch (error) {
        return res.status(403).send(`error al validar usuario: ${error.message}`)
    }
}

async function isAdmin(req, res, next) {
    const { userLoged } = req.usuario
    try {
        const { es_admin } = await getUser(userLoged)
        if(es_admin==1){
            return next()
        }else {return res.status(403).send("No dispone de permiso de administrador")}
    } catch (error) {
        return res.status(400).send("No se pudieron verificar las credenciales")
    }
}


module.exports= { validateUser, authenticateUser, isAdmin }