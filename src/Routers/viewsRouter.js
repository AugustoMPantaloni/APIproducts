const express = require ("express");
const routerRealTimeProducts = express.Router();
const upload = require ("../config/multer")
const { v4: uuidv4, validate: validateUUID } = require("uuid");
const ProductManager = require ("../dao/productManager");
const instanciaProducts = new ProductManager();

module.exports = (io) => {
    //Ruta GET para obtener todos los productos
    routerRealTimeProducts.get("/", async (req, res, next)=>{
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

            res.render("realTimeProducts", { products }); //
            io.emit("getAllProducts", products); 
        }catch(error){
            next(error);
        }
    })

    //Ruta GET para obtener el producto por su ID
    routerRealTimeProducts.get("/:pid", async (req, res, next)=>{
        try{
            const pId = req.params.pid;
            if(!validateUUID(pId)){
                throw new Error("El ID proporcionado no es valido");
            }

            const productId = await instanciaProducts.findProductById(pId);
            if(!productId){
                throw new Error(`No existe ningun producto con ID proporcionado`);
            }
            res.status(200).json({data: productId});
        }catch(error){
            next(error);
        }
    })

    //Ruta POST para agregar un producto
    routerRealTimeProducts.post("/", upload.array("thumbnails"), async (req, res, next)=>{
        try{
            const { title, description, code, price, stock, status,category} = req.body;
            const thumbnails = req.files?.map(file => file.path) || [];

            if (!title || typeof title !== "string") throw new Error("El título es obligatorio y debe ser un texto");
            if (!description || typeof description !== "string") throw new Error("La descripción es obligatoria y debe ser un texto");
            if (!code || typeof code !== "string") throw new Error("El código es obligatorio y debe ser un texto");
            if (!category || typeof category !== "string") throw new Error("La categoría es obligatoria y debe ser un texto");

            if(isNaN(price) || price <= 0){
                throw new Error("El precio debe ser un numero y mayor a 0");
            }
            if(isNaN(stock) || stock <= 0){
                throw new Error("El Stock debe ser un numero y mayor a 0")
            }

            const newProduct = await instanciaProducts.createProduct(title, description, code, price, stock, status,category, thumbnails)
            if(newProduct.error){
                return res.status(400).json({Error: newProduct.error})
            }
            const products = await instanciaProducts.getAllProducts();
            io.emit("getAllProducts", products); 
            res.render("realTimeProducts", { products }); 
        }catch(error){
            next(error)
        }
    })

    //Ruta PUT para modificar un producto
    routerRealTimeProducts.put("/:pid", async (req,res)=>{
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
            next(erro);
            
        }
    })

    //Ruta DELETE para eliminar un producto
    routerRealTimeProducts.delete("/:pid", async (req,res, next)=>{
        try{
            const pId = req.params.pid;
            if(!validateUUID(pId)){
                throw new Error("El ID proporcionado no es valido");
            }

            const deleteProduct = await instanciaProducts.deleteProduct(pId);
            if(!pId){
                throw new Error(`No existe ningun producto con ID ${pId}`)
            }

            const products =  await instanciaProducts.getAllProducts();
            io.emit("getAllProducts", products);
            res.render("realTimeProducts", { products });
        }catch(error){
            next(error);
        }
    })

    return routerRealTimeProducts
}


