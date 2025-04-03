//Dependecias
const express = require ("express");
const routerViewHome = express.Router();
//Manager
const {createProduct, getAllProducts, getProductById, deleteProduct, modProduct, existingCode, validateId} = require ("../dao/productManagerMongo");
const { getCartById} = require ("../dao/cartsManagerMongo");


//Ruta GET para obtener todos los productos
routerViewHome.get("/", async (req, res, next) => {
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

        res.render("home", { 
            products: products.docs,
            pagination:{
                totalPages: products.totalPages,
                currentPage: products.page,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage
            }
            });
    } catch (error) {
        next(error)
    }
});

//Ruta GET para obtener el producto por su ID
routerViewHome.get("/products/:pid", async (req, res, next)=>{
    try{
        const pId = req.params.pid;
        if (!(await validateId(pId))) {  
            throw new Error("El ID proporcionado no es valido");
        }

        const productId = await getProductById(pId);
        if(!productId){
            throw new Error(`No existe ningun producto con ID proporcionado`);
        }
        
        res.render("products", { 
            product: productId, 
            pageTitle: `Detalles de ${productId.title}` 
        });
    }catch(error){
        next(error)
    }
})

//lista los productos que pertenecen al carro de compras seleccionado
routerViewHome.get("/carts/:cid", async (req, res, next) =>{
    try{ 

        const idCart = req.params.cid
        if(!(await validateId(idCart))){
            throw new Error("El ID proporcionado del Carrrito no es valido")
        }

        const cartById = await getCartById(idCart);
        if(!cartById){
            throw new Error("Carrito con el ID proporcionado no existe");
        }

        res.render("cart", {cart: cartById.data.toObject()})
    } catch (error){
        next(error)
    }
})


module.exports = routerViewHome