const mongoose = require ("mongoose");

const ConnectDB = async () =>{
    try{
        await mongoose.connect(process.env.URL_MONGO)
        console.log("Conectado a MongoDB")
    }
        catch(error){
            console.error("Error en la conexion a MongoDB", error)
            process.exit(1);
    }
}

module.exports = ConnectDB