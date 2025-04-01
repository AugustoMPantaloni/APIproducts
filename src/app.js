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
const routerViewHome = require ("./Routers/viewsHome")//Router para la ruta raiz

//configuracion socket.io
const server = http.createServer(app);
const io = new Server(server);

//MongoDB
const ConnectDB = require ("./db")
ConnectDB();

//Middleware 
const errorHandler = require ("./middleware/errorHandler"); //REVISAR ERRORES, HAY MUCHOS REPETIDOS Y ESTAN MAL ORGANIZADOS.
const { error } = require("console");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "..", "public"))); 

//Configuracion Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Rutas
app.use("/", routerViewHome); 
app.use("/realtimeproducts", routerRealTimeProducts(io)); //Ruta para los productos en tiempo real
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use(errorHandler);

//Servidor
const PORT = 8080;
server.listen (PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
})