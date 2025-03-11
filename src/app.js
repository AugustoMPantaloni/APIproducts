const express = require ("express");

const app = express()

app.get("/", (req, res)=>{
    res.send("Servidor en linea");
})

app.use(express.json());

const PORT = 3000;
app.listen (PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
})