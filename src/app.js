const express = require ("express");
const app = express();
const path = require("path");
const routerProducts = require ("./Routers/products");
const routerCarts = require ("./Routers/carts");
const routerRealTimeProducts = require ("./Routers/realTimeProducts"); //Router para los productos en tiempo real
const exphbs = require ("express-handlebars");
const controllerProducts = require ("./controllers/productsController")//Se creo un controlador para mostrar los productos en la ruta home
const http = require ("http");
const {Server} = require ("socket.io");

//configuracion socket.io
const server = http.createServer(app)
const io = new Server(server);

//Middleware 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "..", "public"))); 

//Configuracion Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Rutas
app.use("/home", controllerProducts.getProducts); //Sin modificar la vista "/" a "/home" el controlador renderizaba la vista en todas las rutas, no supe identificar porque.
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/realtimeproducts", routerRealTimeProducts(io)); //Ruta para los productos en tiempo real

//Servidor
const PORT = 8080;
server.listen (PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
})