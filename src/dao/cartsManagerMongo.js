const CartModel = require("../models/cartsModel")
const ProductsModel = require ("../models/productsModel")
const mongoose = require ("mongoose");

    //Funcion que valida el ID
    async function validateId(id){
        return mongoose.Types.ObjectId.isValid(id)
    }

    //Crear un nuevo carro de compras
    async function createCart(){
        try{
            const newCart = new CartModel({ cart: [] })
            await newCart.save()

            return {success: true, cart: newCart}
        }catch(error){
            console.error("Error al intentar crear un carrito", error.message);
            return {error: error.message};
        }
    }

    //Agrega producto al carrito con ID seleccionado
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
                return{ success: true, cart: newCart}
            }

            return{success: true, cart: result}
        }catch(error){
            console.error("Error al agregar un producto al carrito", error.message);
            return{Error: error.message};
        }
    }

    //Lista los productos del carrito segun un ID
    async function getCartById (id){
        try{

            const cartById =  await cartsModel.findById(id)

            return {success: true, cart: cartById}
        }catch(error){
            console.error("Error al listar los productos del Cart", error.message)
            return {error: error.message};
        }
    }


module.exports = CartManager;