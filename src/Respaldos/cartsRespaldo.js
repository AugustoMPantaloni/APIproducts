//Dependencias
const express = require ("express");
const routerCarts = express.Router();
const { v4: uuidv4, validate: validateUUID } = require("uuid");
//clases
const cartManager = require("../dao/cartsManager");
const instanciaCarts = new cartManager();

//lista los productos que pertenecen al carrito seleccionado
routerCarts.get ("/:cid", async (req, res, next) =>{
    try{ 

        const idCart = req.params.cid
        if(!validateUUID(idCart)){
            throw new Error(`El ID proporcionado del Carrrito no es valido`);
        }

        const cartById = await instanciaCarts.getCartById(idCart);
        if(!cartById){
            throw new Error(`Carrito con el ID proporcionado no existe`);
        }

        res.status(200).json(cartById)
    } catch (error){
        next(error)
    }
})

//Crea un nuevo carrito
routerCarts.post("/", async (req, res, next) =>{
    try{
        const newCart = await instanciaCarts.createCart()
        
        res.status(201).json({
            mensaje: "Carrito creado con exito",
            carritoCreado: newCart
        })
    }catch (error) {
        next(error);
    }
})

//Agregar un producto al carrito
routerCarts.post("/:cid/product/:pid", async (req,res, next)=>{
    try{
        const cartId = req.params.cid;
        const productId = req.params.pid;
        if(!validateUUID(cartId)){
            throw new Error(`El ID proporcionado del Carrito no es valido`);
        }
        if(!validateUUID(productId)){
            throw new Error(`El ID proporcionado del Producto no es valido`);
        }

        const cart = await instanciaCarts.getCartById(cartId)
        if(!cart){
            throw new Error(`Carrito con el ID proporcionado no existe`);
        }
        
        await instanciaCarts.addProductToCart(cartId, productId)  

        res.status(200).json({ 
            mensaje:`Producto con ID ${productId} agregado correctamente al carrito con ID ${cartId}`
        })        
    }catch(error){
        next(error)
    }
})



module.exports = routerCarts;