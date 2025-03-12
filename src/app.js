const express = require ("express");
const app = express();
const routerProducts = require ("./Routers/products")
const routerCarts = require ("./Routers/carts")

app.use(express.json());

app.use("/api/products", routerProducts)
app.use("/api/carts", routerCarts);

app.get("/", (req, res)=>{
    res.send("Servidor en linea");
})

const PORT = 8080;
app.listen (PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
})