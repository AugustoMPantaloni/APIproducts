//Dependencias
const express = require ("express");
const routerCarts = express.Router();
const mongoose = require ("mongoose");
//CartManager
const {createCart, addProductToCart, getCartById, updateQuantityProduct, validateId, emptyCart, deleteProductCart, updateCartProducts} = require ("../dao/cartsManagerMongo");


//lista los productos que pertenecen al carro de compras seleccionado
routerCarts.get ("/:cid", async (req, res, next) =>{
    try{ 

        const idCart = req.params.cid
        if(!(await validateId(idCart))){
            throw new Error("El ID proporcionado del Carrito no es valido")
        }

        const cartById = await getCartById(idCart);
        if(!cartById){
            throw new Error("Carrito con el ID proporcionado no existe");
        }

        res.status(200).json({data: cartById})
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
            carritoCreado: newCart.data,
            cartId: newCart.data._id
        })
    }catch (error) {
        next(error);
    }
})

//Agrega producto al carro de compras 
routerCarts.post("/:cid/product/:pid", async (req, res, next)=>{
    try{
        const idCart = req.params.cid;
        const idProduct = req.params.pid;
        if(!(await validateId(idCart))){
            throw new Error("El ID proporcionado del Carrito no es valido")
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
            throw new Error("El ID proporcionado del Carrito no es valido")
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

//Vacia el carro de compras
routerCarts.delete("/:cid", async(req, res, next)=>{
    try{
        const idCart = req.params.cid;
        if(!(await validateId(idCart))){
            throw new Error("El ID proporcionado del Carrito no es valido")
        }

        const updateCart = await emptyCart(idCart)
        if(!updateCart){
            throw new Error("Carrito con el ID proporcionado no existe")
        }
        res.status(200).json({mensaje: "El carrito fue vaciado con exito"})
    }catch(error){
        next(error)
    }
})

//Elimina un solo producto del carro de compras
routerCarts.delete("/:cid/product/:pid", async(req, res, next) =>{
    try{
        const idCart = req.params.cid;
        const idProduct = req.params.pid;
        if(!(await validateId(idCart))){
            throw new Error("El ID proporcionado del Carrito no es valido")
        }
        if(!(await validateId(idProduct))){
            throw new Error("El ID proporcionado del Producto no es valido")
        }

        const updateCart = await deleteProductCart(idCart, idProduct)
        if(!updateCart){
            throw new Error("Carrito o producto no encontrado")
        }
        res.status(200).json({mensaje:"Se elimino con exito el producto del carro de compras"})
    }catch(error){
        next(error)
    }
})

//Actualiza el carro de compras con un array de productos... Falta agregar una validacion para que se incremente la cantidad si el producto ya existe.
routerCarts.put("/:cid/", async (req, res, next)=>{
    try{
        const idCart = req.params.cid;
        if(!(await validateId(idCart))){
            throw new Error("El ID proporcionado del Carrito no es valido")
        }
        
        const {products} = req.body
        if(!Array.isArray(products)){
            throw new Error("¡Los productos deben ser un array no vacio!")
        }
        
        const validateProducts = products.every(product => (
            product &&
            product.product &&
            mongoose.Types.ObjectId.isValid(product.product) &&
            product.quantity &&
            typeof product.quantity === "number" &&
            Number.isInteger(product.quantity)&&
            product.quantity > 0 
        ))

        if(!validateProducts){
            throw new Error("Error en el campo del producto. Cada producto debe tener: -Un ID valido de mongoose. -Una Quantity que sea de tipo numero, entero y mayor a 0"
            )
        }

        const updateCart = await updateCartProducts(idCart, products)
        if(!updateCart){
            throw new Error("Carrito o producto no encontrado")
        }

        res.status(200).json({mensaje:"Productos añadidos al carro de compras"})
    }catch(error){
        next(error)
    }
})

module.exports = routerCarts;