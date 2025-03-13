const express = require ("express");
const app = express();
const path = require("path");
const routerProducts = require ("./Routers/products");
const routerCarts = require ("./Routers/carts");
const exphbs = require ("express-handlebars");
const controllerProducts = require ("./controllers/productsController")//Se creo un controlador para mostrar los productos.

//Middleware para parseo de JSON
app.use(express.json());

//Configuracion para servir archivos estaticos
app.use(express.static(path.join(__dirname, "..", "public"))); 

//Configuracion Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//Definimos la carpeta de rutas
app.set("views", path.join(__dirname, "views"));

//Routers
app.use("/api/products", routerProducts)
app.use("/api/carts", routerCarts);
app.use("/realtimeproducts,  ") //Falta agregar el router con los webSockets

//Ruta raiz
app.use("/", controllerProducts.getProducts)

//Ruta Para los productos en tiempo real
app.get("/realtimeproducts",(req, res)=>{
    res.render("realTimeProducts",)
})

//Servidor
const PORT = 8080;
app.listen (PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
})