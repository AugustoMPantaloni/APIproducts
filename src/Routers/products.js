const express = require ("express");
const routerProducts = express.Router();
const { v4: uuidv4, validate: validateUUID } = require("uuid");

const ProductManager = require ("../Models/productManager");
const instanciaProducts = new ProductManager();

//Ruta GET para obtener todos los productos
routerProducts.get("/", async (req, res)=>{
    try{
        const products =  await instanciaProducts.getAllProducts();
        res.status(200).json({Data: products})
        
    }catch(error){
        res.status(500).json({Mensaje: "Error interno del servidor."})
    }
})

//Ruta GET para obtener el producto por su ID
routerProducts.get("/:pid", async (req, res)=>{
    try{
        const pId = req.params.pid;

        const productId = await instanciaProducts.findProductById(pId);
        
        res.status(200).json({data: productId});
    }catch(error){

        if (error.message.includes("El ID proporcionado no es válido")) {
            return res.status(400).json({ Mensaje: error.message });
        }
        if (error.message.includes("No existe ningún producto con ID")) {
            return res.status(404).json({ Mensaje: error.message });
        }

        console.error("Error en la ruta GET /:pid:", error.message);
        res.status(500).json({ Mensaje: "Error interno del servidor" });
    }
})

//Ruta POST para agregar un producto
routerProducts.post("/", async (req, res)=>{
    try{
        const { title, description, code, price, stock, status,category, thumbnails} = req.body;

        const newProduct = await instanciaProducts.createProduct(title, description, code, price, stock, status,category, thumbnails)
        if(newProduct.error){
            return res.status(400).json({Error: newProduct.error})
        }
        res.status(201).json({Mensaje: "Nuevo producto creado", newProduct})
    }catch(error){
        console.error("Error en la ruta POST /:", error.message)
        res.status(500).json({mensaje:"Error interno del servidor"})
    }
})

//Ruta PUT para modificar un producto
routerProducts.put("/:pid", async (req,res)=>{
    try{
        const pId = req.params.pid;

        const updateData = req.body

        const modProduct = await instanciaProducts.modProduct(pId, updateData)

        if(modProduct.error){
            return res.status(400).json({error: modProduct.error})
        }
        res.status(200).json({Mensaje: "Producto Modificado" ,modProduct})
    }catch(error){
        console.error("Error en la ruta PUT/:", error.message)
        res.status(500).json({Mensaje: "Error interno del servidor"})
        
    }
})

//Ruta DELETE para eliminar un producto
routerProducts.delete("/:pid", async (req,res)=>{
    try{
        const pId = req.params.pid;

        const deleteProduct = await instanciaProducts.deleteProduct(pId);

        if(deleteProduct.error){
            return res.status(404).json({error: deleteProduct.error})
        }

        res.status(200).json({Mensaje: "Producto Eliminado", deleteProduct})
    }catch(error){
        console.error("Error en la ruta DELETE/:", error.message)
        res.status(500).json({Mensaje: "Error interno del servidor"})
    }
})

module.exports = routerProducts;


