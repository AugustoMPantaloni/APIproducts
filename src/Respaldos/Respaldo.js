const express = require ("express");
const routerProducts = express.Router();
const { v4: uuidv4, validate: validateUUID } = require("uuid");

const ProductManager = require ("../dao/productManager");
const { array } = require("../config/multer");
const instanciaProducts = new ProductManager();

//Ruta GET para obtener todos los productos
routerProducts.get("/", async (req, res)=>{
    try{
        const products =  await instanciaProducts.getAllProducts();

        if(!Array.isArray(products)){
            throw new Error("Formato invalido de productos")
        }

        if(products.length === 0 ){
            return res.status(200).json({
                    mensaje:"No hay productos disponibles", 
                    data: products})
        }

        res.status(200).json({
            mensaje:"Productos obtenidos exitosamente",
            data: products});  
    }catch(error){
        console.error("Error en la ruta GET / ", error.message)

        if(error.message === "Formato invalido de productos" ){
            return res.status(500).json({error: error.message})
        }

        res.status(500).json({error: "Error interno del servidor"});
    }
})

//Ruta GET para obtener el producto por su ID
routerProducts.get("/:pid", async (req, res)=>{
    try{
        const pId = req.params.pid;
        if(!validateUUID(pId)){
            throw new Error("El ID proporcionado no es valido");
        }

        const productId = await instanciaProducts.findProductById(pId);
        if(!productId){
            throw new Error(`No existe ningun producto con ID proporcionado`);
        }
        
        res.status(200).json({mensaje:"Producto obtenido exitosamente", data: productId});
    }catch(error){
        console.error("Error en la ruta GET /:pid:", error.message);

        if (error.message === "El ID proporcionado no es valido" ||
            error.message === `No existe ningun producto con ID proporcionado`) {
            return res.status(400).json({ Mensaje: error.message });
        }

        res.status(500).json({ Mensaje: "Error interno del servidor" });
    }
})

//Ruta POST para agregar un producto
routerProducts.post("/", async (req, res)=>{
    try{
        const { title, description, code, price, stock, status, category, thumbnails} = req.body;
        
        if (!title || typeof title !== "string") throw new Error("El título es obligatorio y debe ser un texto");
        if (!description || typeof description !== "string") throw new Error("La descripción es obligatoria y debe ser un texto");
        if (!code || typeof code !== "string") throw new Error("El código es obligatorio y debe ser un texto");
        if (!category || typeof category !== "string") throw new Error("La categoría es obligatoria y debe ser un texto");
        if (status === undefined || typeof status !== "boolean") throw new Error("El status es obligatorio y debe ser un booleano");

        if(isNaN(price) || price <= 0){
            throw new Error("El precio debe ser un numero y mayor a 0");
        }

        if(isNaN(stock) || stock <= 0){
            throw new Error("El Stock debe ser un numero y mayor a 0")
        }

        if (!Array.isArray(thumbnails)) {
            throw new Error( "Thumbnails debe ser un array");
        }

        const newProduct = await instanciaProducts.createProduct(title, description, code, price, stock, status, category, thumbnails);

        res.status(201).json({Mensaje: "Nuevo producto creado", newProduct})
    }catch(error){
        console.error("Error en la ruta POST /:", error.message)

        if(error.message === "El status es obligatorio" || 
            error.message === "La categoría es obligatoria" || 
            error.message === "El stock es obligatorio" || 
            error.message === "El precio es obligatorio" || 
            error.message === "El código es obligatorio" || 
            error.message === "La descripción es obligatoria" ||
            error.message === "El título es obligatorio" ||
            error.message === "Thumbnails debe ser un array" )
            {
            return res.status(400).json({error: error.message})
        }

        res.status(500).json({mensaje:"Error interno del servidor"})
    }
})

//Ruta PUT para modificar un producto
routerProducts.put("/:pid", async (req,res)=>{
    try{
        const pId = req.params.pid;
        if(!validateUUID(pId)){
            throw new Error("El ID proporcionado no es valido");
        }

        const updateData = req.body
        if(!updateData || Object.keys(updateData).length === 0 || typeof updateData !== "object") {
            throw new Error("Los datos de actualización deben ser un objeto no vacio");
        }

        const modProduct = await instanciaProducts.modProduct(pId, updateData)

        res.status(200).json({Mensaje: "Producto Modificado" ,modProduct})
    }catch(error){
        console.error("Error en la ruta PUT/:", error.message)

        if(error.message === "El ID proporcionado no es valido" ||
            error.message === "Los datos de actualización deben ser un objeto no vacio"){
            return res.status(400).json({error: error.message})
            }

        res.status(500).json({Mensaje: "Error interno del servidor"})
        
    }
})

//Ruta DELETE para eliminar un producto
routerProducts.delete("/:pid", async (req,res)=>{
    try{
        const pId = req.params.pid;
        if(!validateUUID(pId)){
            throw new Error("El ID proporcionado no es valido");
        }

        const deleteProduct = await instanciaProducts.deleteProduct(pId);
        if(!pId){
            throw new Error(`No existe ningun producto con ID ${pId}`)
        }

        res.status(200).json({Mensaje: "Producto Eliminado", deleteProduct})
    }catch(error){
        console.error("Error en la ruta DELETE/:", error.message)

        if(error.message === "El ID proporcionado no es valido" ||
            error.message === `No existe ningun producto con ID ${pId}`)
            {
            return res.status(400).json({error: error.message})
        }

        res.status(500).json({Mensaje: "Error interno del servidor"})
    }
})

module.exports = routerProducts;