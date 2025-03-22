const productManager = require("../dao/productManager");
const instanciaProducts = new productManager();

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