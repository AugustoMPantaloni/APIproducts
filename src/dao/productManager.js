const ProductsModel = require ("../models/productsModel")
const mongoose = require("mongoose")

//Crea un nuevo producto
    async function createProduct(title, description, code, price, stock, status, category, thumbnails=[]){
        try{
            let newProduct = new ProductsModel({
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails,
                status,
            })

            await newProduct.save();
            return newProduct;         
        }catch(error){
            console.error("Error al intentar crear un nuevo producto", error.message)
            return { error: error.message }
        }
    }
//Obtener todos los productos
    async function  getAllProducts(){
        try{
            const products = await ProductsModel.find()
            return products;
        }catch(error){
            console.error("Error al obtener la lista de productos", error.message)
            return { error: error.message }
        }
    }
//Obtener el producto filtrado por su ID
    async function getProductById(id) {
        try{
            const productId = await ProductsModel.findById(id)
            return productId;
        } catch(error){
            console.error("Error al obtener el producto por su ID", error.message)
            return { error: error.message }
        }
    }
//Borra un producto filtrado por su ID
    async function deleteProduct(id){
        try{
            const productRemoved = await ProductsModel.findByIdAndDelete(id)

            return productRemoved;
        }catch(error){
            console.error("Error al eliminar un producto", error.message)
            return { error: error.message }
        }


    }
//Modifica un producto filtrado por su ID
    async function modProduct(id, updateData){
        try{
            const productMod = await ProductsModel.findByIdAndUpdate(id, updateData, {new: true});

            return productMod;
        }catch(error){
            console.error(`Ocurrio un error al modificar el producto con ID ${id}`, error.message);
            return { error: error.message }
        }
    }
//Busca el producto por su Codigo para poder hacer la validacion en el Router
    async function existingCode(code) {
        try{
            const codeProduct = await ProductsModel.findOne({code})
            return codeProduct;
        }catch(error){
            console.error("Ocurrio un error al obtener el codigo del producto", error.message)
            return {error: error.message}
        }
    }

    async function validateId(id){
            return mongoose.Types.ObjectId.isValid(id)
    }

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    modProduct,
    existingCode,
    validateId
}



