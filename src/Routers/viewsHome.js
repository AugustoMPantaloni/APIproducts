const productManager = require("../Respaldos/productManagerRespaldo");
const instanciaProducts = new productManager();
const {createProduct, getAllProducts, getProductById, deleteProduct, modProduct, existingCode, validateId} = require ("../dao/productManager")

const getProducts = async (req, res) => {
    try {
        const products = await instanciaProducts.getAllProducts();
        res.render("home", { products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
};

module.exports = {getProducts,};