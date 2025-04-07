//Dependencias
const express = require ("express");
const app = express();
const path = require("path");
const http = require ("http");
const {Server} = require ("socket.io");
const exphbs = require ("express-handlebars");
const Handlebars = require("./helpers/handlebarsHelpers"); 
require ("dotenv").config() 

//Router y controladores
const routerProducts = require ("./Routers/products");
const routerCarts = require ("./Routers/carts");
const routerRealTimeProducts = require ("./Routers/viewsRouter"); 
const routerViewHome = require ("./Routers/viewsHome")

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
app.use(errorHandler);

//Configuracion Handlebars
app.engine("handlebars", exphbs.engine({
    handlebars: Handlebars
}));

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

//Rutas
app.use("/", routerViewHome); 
app.use("/realtimeproducts", routerRealTimeProducts(io)); 
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

//Servidor
const PORT = (process.env.PORT);
server.listen (PORT,()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
})