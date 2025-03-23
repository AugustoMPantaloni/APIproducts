const mongoose = require ("mongoose");
const { array } = require ("../config/multer");

const ProductsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true,
        unique: true,
    },
    price:{
        type: Number,
        required: true,
        min: 1
    },
    stock:{
        type: Number,
        required: true,
        min:0
    },
    status:{
        type: Boolean,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    thumbnails:{
        type: [String],
        default: []
    }
})

const ProductManagerMongoose = mongoose.model("Products", ProductsSchema)

module.exports = ProductManagerMongoose