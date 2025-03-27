const CartModel = require("../models/cartsModel")
const mongoose = require ("mongoose");

    //Funcion que valida el ID
    async function validateId(id){
        return mongoose.Types.ObjectId.isValid(id)
    }

    //Crear un nuevo carro de compras
    async function createCart(){
        try{
            const newCart = new CartModel()
            await newCart.save()

            return {success: true, data: newCart}
        }catch(error){
            console.error("Error al intentar crear un carrito", error.message);
            return {error: error.message};
        }
    }

    //Agrega producto al carro de compras con ID seleccionado
    async function addProductToCart(cartId, productId){
        try{
            const result = await CartModel.findOneAndUpdate(
                {
                    _id: cartId,
                    "cart.product" : productId
                },
                {$inc:{"cart.$.quantity":1} },
                {new: true}
            );
            if(!result){
                const newCart = await CartModel.findByIdAndUpdate(
                    cartId,
                    {$push:{cart:{product: productId, quantity: 1}
                } },
                    {new: true}
                )
                return{ success: true, data: newCart}
            }

            return{success: true, cart: result}
        }catch(error){
            console.error("Error al agregar un producto al carrito", error.message);
            return{Error: error.message};
        }
    }

    //lista los productos que pertenecen al carro de compras seleccionado
    async function getCartById (id){
        try{
            const cartById =  await CartModel.findById(id).populate("cart.product")
            return {success: true, data: cartById}
        }catch(error){
            console.error("Error al listar los productos del Cart", error.message)
            return {error: error.message};
        }
    }

    //Actualiza la cantidad de un producto dentro de un carro de compras
    async function updateQuantityProduct (cartId, productId, newQuantity){
        try{
            const updateCart = await CartModel.findOneAndUpdate(
                {
                    _id: cartId,
                "cart.product": productId
                },
                {$set: {"cart.$.quantity": newQuantity} },
                {new: true}
            )
            return {success: true, data: updateCart}
        }catch(error){
            console.error("Error al aumentar la cantidad del producto", error.message)
            return{Error: error.message}
        }
    }

    //Elimina todos los productos del carro de compras
    async function emptyCart(cartId){
        
    }

    module.exports = {
        createCart,
        addProductToCart,
        getCartById,
        updateQuantityProduct,
        validateId
    }