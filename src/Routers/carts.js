const express = require ("express");
const routerCarts = express.Router();

const cartManager = require("../dao/cartsManager");
const instanciaCarts = new cartManager();
const productManager = require ("../dao/productManager");
const instanciaProducts = new productManager();

//lista los productos que pertenecen al carrito seleccionado
routerCarts.get ("/:cid", async (req, res) =>{
    try{ 

        const idCart = req.params.cid

        const cartById = await instanciaCarts.getCartById(idCart);

        if (cartById.error){
            return res.status(404).json({Mensaje: cartById.error})
        }

        res.status(200).json(cartById)
    } catch (error){
        console.error("Error en la ruta GET /:cid:", error.message);
        res.status(500).json({ Mensaje: "Error interno del servidor" })
    }
})

//Crea un nuevo carrito
routerCarts.post("/", async (req, res) =>{
    try{
        const newCart = await instanciaCarts.createCart()
        
        res.status(201).json({
            mensaje: "Carrito creado con exito",
            carritoCreado: newCart
        })
    }catch (error) {
        console.error("Error al crear el carrito", error.message);
        res.status(500).json({
            mensaje:"Error al crear el carrito",
            error: error.message })
    }
})

//Agregar un producto al carrito
routerCarts.post("/:cid/product/:pid", async (req,res)=>{
    try{
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await instanciaCarts.getCartById(cartId)
        if(cart.error){
            return res.status(404).json({mensaje: cart.error})
        }

        const productExists = await instanciaProducts.getProductById(productId);
        if (productExists.error) {
            return res.status(404).json({Mensaje: productExists.error});
        }

        await instanciaCarts.addProductToCart(cartId, productId)
        
        res.status(200).json({ 
            mensaje:`Producto con ID ${productId} agregado correctamente al carrito con ID ${cartId}`
        })
        
    }catch(error){
        console.error("Error al agregar un producto al carrito", error.message);
        res.status(500).json({
            mensaje: "Error al agregar un producto al carrito", 
            error: error.message})
    }
})



module.exports = routerCarts;