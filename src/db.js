const mongoose = require ("mongoose");

const ConnectDB = async () =>{
    try{
        await mongoose.connect("mongodb+srv://augustompantaloni:maxi15632489@cluster0.hxdak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Conectado a MongoDB")
    }
        catch(error){
            console.error("Error en la conexion a MongoDB", error)
            process.exit(1);
    }
}

module.exports = ConnectDB