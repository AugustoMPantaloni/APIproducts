//Dependencias
const express = require ("express");
const routerCarts = express.Router();
//CartManager
const {createCart, addProductToCart, getCartById, updateQuantityProduct, validateId} = require ("../dao/cartsManagerMongo")

//lista los productos que pertenecen al carro de compras seleccionado
routerCarts.get ("/:cid", async (req, res, next) =>{
    try{ 

        const idCart = req.params.cid
        if(!(await validateId(idCart))){
            throw new Error("El ID proporcionado del Carrrito no es valido")
        }

        const cartById = await getCartById(idCart);
        if(!cartById){
            throw new Error("Carrito con el ID proporcionado no existe");
        }

        res.status(200).json(cartById)
    } catch (error){
        next(error)
    }
})

//Crea un nuevo carro de compras
routerCarts.post("/", async (req, res, next) =>{
    try{
        const newCart = await createCart()
        
        res.status(201).json({
            mensaje: "Carrito creado con exito",
            carritoCreado: newCart
        })
    }catch (error) {
        next(error);
    }
})

//Agrega producto al carro de compras con ID seleccionado
routerCarts.post("/:cid/product/:pid", async (req, res, next)=>{
    try{
        const idCart = req.params.cid;
        const idProduct = req.params.pid;
        if(!(await validateId(idCart))){
            throw new Error("El ID proporcionado del Carrrito no es valido")
        }
        if(!(await validateId(idProduct))){
            throw new Error("El ID proporcionado del Producto no es valido")
        }

        const cart = await getCartById(idCart)
        if(!cart){
            throw new Error("Carrito con el ID proporcionado no existe");
        }
        
        await addProductToCart(idCart, idProduct)  

        res.status(200).json({ 
            mensaje:`Producto con ID ${idProduct} agregado correctamente al carrito con ID ${idCart}`
        })        
    }catch(error){
        next(error)
    }
})

//Actualiza la cantidad de un producto dentro de un carro de compras
routerCarts.put("/:cid/products/:pid", async(req, res, next)=>{
    try{
        const idCart = req.params.cid;
        const idProduct = req.params.pid;
        if(!(await validateId(idCart))){
            throw new Error("El ID proporcionado del Carrrito no es valido")
        }
        if(!(await validateId(idProduct))){
            throw new Error("El ID proporcionado del Producto no es valido")
        }
        
        const {quantity} = req.body
        if(typeof quantity !== "number" || quantity <= 0 || !Number.isInteger(quantity)){
            throw new Error("La cantidad debe ser un numero entero y mayor a 0")
        }

        const updateCart = await updateQuantityProduct(idCart, idProduct, quantity)
        if(!updateCart){
            throw new Error("Carrito o producto no encontrado")
        }

        res.status(200).json({mensaje: `Cantidad del producto ${idProduct} actualizada a ${quantity}`})
    }catch(error){
        next(error)
    }
})
module.exports = routerCarts;