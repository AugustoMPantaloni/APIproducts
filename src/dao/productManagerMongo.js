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
    async function  getAllProducts(page=1, limit=10, category, status, sort){
        try{
            const options = {
                page: Math.max(1, parseInt(page)),
                limit: Math.min(50, parseInt(limit)),
                sort: sort === "asc"? {price:1}: sort === "desc"? {price: -1}: undefined,
                lean: true,
            }
            const query = {}
            if(category){
                query.category = category
            }
            if(status){
                query.status = status
            }

            const result = await ProductsModel.paginate(query, options);

            return result;
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
//Funcion que valida el ID
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



