const express = require ("express");
const routerRealTimeProducts = express.Router();
const upload = require ("../config/multer")

const ProductManager = require ("../dao/productManager");
const instanciaProducts = new ProductManager();

module.exports = (io) => {
    //Ruta GET para obtener todos los productos
    routerRealTimeProducts.get("/", async (req, res)=>{
        try{
            const products =  await instanciaProducts.getAllProducts();
            res.render("realTimeProducts", { products }); //
            io.emit("getAllProducts", products); 
        }catch(error){
            res.status(500).json({Mensaje: "Error interno del servidor."})
        }
    })

    //Ruta GET para obtener el producto por su ID
    routerRealTimeProducts.get("/:pid", async (req, res)=>{
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
    routerRealTimeProducts.post("/", upload.array("thumbnails"), async (req, res)=>{
        try{
            const { title, description, code, price, stock, status,category} = req.body;
            const thumbnails = req.files?.map(file => file.path) || [];

            const newProduct = await instanciaProducts.createProduct(title, description, code, price, stock, status,category, thumbnails)
            if(newProduct.error){
                return res.status(400).json({Error: newProduct.error})
            }
            const products = await instanciaProducts.getAllProducts();
            io.emit("getAllProducts", products); 
            res.render("realTimeProducts", { products }); 
        }catch(error){
            console.error("Error en la ruta POST /:", error.message)
            res.status(500).json({mensaje:"Error interno del servidor"})
        }
    })

    //Ruta PUT para modificar un producto
    routerRealTimeProducts.put("/:pid", async (req,res)=>{
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
    routerRealTimeProducts.delete("/:pid", async (req,res)=>{
        try{
            const pId = req.params.pid;

            const deleteProduct = await instanciaProducts.deleteProduct(pId);

            if(deleteProduct.error){
                return res.status(404).json({error: deleteProduct.error})
            }

            const products =  await instanciaProducts.getAllProducts();
            io.emit("getAllProducts", products);
            res.render("realTimeProducts", { products });
        }catch(error){
            console.error("Error en la ruta DELETE/:", error.message)
            res.status(500).json({Mensaje: "Error interno del servidor"})
        }
    })

    return routerRealTimeProducts
}


