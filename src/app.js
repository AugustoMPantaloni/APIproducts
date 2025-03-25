//Dependencias
const express = require ("express");
const app = express();
const path = require("path");
const http = require ("http");
const {Server} = require ("socket.io");
const exphbs = require ("express-handlebars");
//Router y controladores
const routerProducts = require ("./Routers/products");
const routerCarts = require ("./Routers/carts");
const routerRealTimeProducts = require ("./Routers/viewsRouter"); //Router para los productos en tiempo real
const controllerProducts = require ("./Routers/viewsHome")//Se creo un controlador para mostrar los productos en la ruta home

//configuracion socket.io
const server = http.createServer(app);
const io = new Server(server);

//MongoDB
const ConnectDB = require ("./db")
ConnectDB();

//Middleware 
const errorHandler = require ("./middleware/errorHandler");
const { error } = require("console");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "..", "public"))); 

//Configuracion Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Rutas
app.get("/", controllerProducts.getProducts); 
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/realtimeproducts", routerRealTimeProducts(io)); //Ruta para los productos en tiempo real
app.use(errorHandler);

//Servidor
const PORT = 8080;
server.listen (PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
})