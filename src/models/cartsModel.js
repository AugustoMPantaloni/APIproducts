const mongoose = require ("mongoose")

const CartsSchema = new mongoose.Schema(
    {
        cart:[
            {
                _id: false,
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Products",
                    required: true
                },
                quantity:{
                    type: Number,
                    required: true,
                    default: 1
                },
            }
        ],
    },
    {
        timestamps:true
    }
)

const CartModel = mongoose.model("Carts", CartsSchema)

module.exports = CartModel