//Dependecias
const express = require ("express");
const routerProducts = express.Router();
//Validacion ID
const { v4: uuidv4, validate: validateUUID } = require("uuid");
//Clase
const ProductManager = require ("../dao/productManager");
const instanciaProducts = new ProductManager();

//Ruta GET para obtener todos los productos
routerProducts.get("/", async (req, res, next)=>{
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
        next(error)
    }
})

//Ruta GET para obtener el producto por su ID
routerProducts.get("/:pid", async (req, res, next)=>{
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
        next(error)
    }
})

//Ruta POST para agregar un producto
routerProducts.post("/", async (req, res, next)=>{
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
        next(error)
    }
})

//Ruta PUT para modificar un producto
routerProducts.put("/:pid", async (req,res, next)=>{
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
        next(error)   
    }
})

//Ruta DELETE para eliminar un producto
routerProducts.delete("/:pid", async (req,res, next)=>{
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
        next(error)
    }
})

module.exports = routerProducts;


