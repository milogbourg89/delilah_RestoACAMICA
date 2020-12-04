const Sequelize = require("sequelize")
const database = "delila_resto"
const username = "root"
const password = "Bariloche2020"

const sequelize = new Sequelize({
    database: database,
    username: username, 
    password: password,
    host: "localhost",
    dialect: "mysql",
    define: { timestamps:false},
})
sequelize.authenticate()
.then(() => console.log('Conexión establecida exitosamente!' ))
.catch(err => console.log(err))

const Users = sequelize.define("usuarios",{ 
    id_usuario: { 
        primaryKey: true, 
        autoIncrement: true, 
        type: Sequelize.INTEGER, 
        allowNull: false,
    },
    nombre_usuario: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nombre_apellido: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    direccion: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    telefono: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    es_admin: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
})
const Products = sequelize.define("platos", {
   id_plato: {
       type: Sequelize.INTEGER,
       primaryKey: true,
       autoIncrement: true,
       allowNull: false, 
   } ,
   nombre_plato: {
       type: Sequelize.STRING,
       allowNull: false, 
   }, 
   precio_plato: {
       type: Sequelize.INTEGER,
       allowNull: false, 
   }
})

const Orders = sequelize.define("pedidos", {
    id_pedido: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false, 
    },
    precio_total: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }, 
    estado_pedido: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    metodo_pago: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    direccion: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    fecha_pedido: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    id_usuario_pedido: {
        type: Sequelize.INTEGER,
        references: {
            model: Users,
            key: "id_usuario"
        },
        allowNull: false, 
    },
})

const PxOrders = sequelize.define( "platos_x_pedidos", {
    id_plato: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        allowNull: false,
        references: {
            model: Products,
            key: "id_plato"
        },
    },
    id_pedido: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false, 
        references: {
            model: Orders,
            key: "id_pedido"
        },
    },
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
})

Users.hasMany(Orders,{ foreignKey: "id_usuario_pedido"})
Orders.belongsTo(Users, { foreignKey: "id_usuario_pedido" })
Orders.belongsToMany(Products, { through: PxOrders, foreignKey: "id_pedido" })
Products.belongsToMany(Orders, { through: PxOrders, foreignKey: "id_plato"}) 


module.exports= { Sequelize,sequelize,Users,Products,Orders,PxOrders }