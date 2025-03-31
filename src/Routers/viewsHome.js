const {createProduct, getAllProducts, getProductById, deleteProduct, modProduct, existingCode, validateId} = require ("../dao/productManagerMongo")

const getProducts = async (req, res) => {
    try {
        const {page, limit, category, status, sort} = req.query
        const products =  await getAllProducts(page, limit, category, status, sort);
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        if(pageNum){
            if ( isNaN(pageNum) || pageNum <= 0) {
                throw new Error("El parámetro 'page' debe ser un número entero positivo.");
            }
        }
        
        if(limitNum){
            if (isNaN(limitNum) || limitNum <= 0) {
                throw new Error("El parámetro 'limit' debe ser un número entero positivo.");
            }
        }
        
        if (status) {
            if (status !== "true" && status !== "false") {
                throw new Error("El parámetro 'status' solo puede ser 'true' o 'false'.");
            }
        }

        if (sort && !["asc", "desc"].includes(sort.toLowerCase())) {
            throw new Error("El parámetro 'sort' solo puede ser 'asc' o 'desc'.");
        }

        res.render("home", { products:products.docs });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
};

module.exports = {getProducts,};