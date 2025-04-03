//Dependencias
const express = require ("express");
const routerRealTimeProducts = express.Router();
//Multer
const upload = require ("../config/multer")
//ProductManager
const {createProduct, getAllProducts, getProductById, deleteProduct, modProduct, existingCode, validateId} = require ("../dao/productManagerMongo")

module.exports = (io) => {
    //Ruta GET para obtener todos los productos
    routerRealTimeProducts.get("/", async (req, res, next)=>{
        try{
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

            io.emit("getAllProducts", {
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

            res.render("realTimeProducts", {
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
        }catch(error){
            next(error);
        }
    })

    //Ruta GET para obtener el producto por su ID
    routerRealTimeProducts.get("/:pid", async (req, res, next)=>{
        try{
            const pId = req.params.pid;
            if (!(await validateId(pId))) {  
                throw new Error("El ID proporcionado no es valido");
            }

            const productId = await getProductById(pId);
            if(!productId){
                throw new Error(`No existe ningun producto con ID proporcionado`);
            }
            res.status(200).json({data: productId});
        }catch(error){
            next(error);
        }
    })

    //Ruta POST para agregar un producto
    routerRealTimeProducts.post("/", upload.array("thumbnails"), async (req, res, next)=>{
        try{
            const { title, description, code, price, stock, status,category} = req.body;
            const thumbnails = req.files?.map(file => file.path) || [];

            if (!title || typeof title !== "string") throw new Error("El título es obligatorio y debe ser un texto");
            if (!description || typeof description !== "string") throw new Error("La descripción es obligatoria y debe ser un texto");
            if (!code || typeof code !== "string") throw new Error("El código es obligatorio y debe ser un texto");
            if (!category || typeof category !== "string") throw new Error("La categoría es obligatoria y debe ser un texto");

            if(isNaN(price) || price <= 0){
                throw new Error("El precio debe ser un numero y mayor a 0");
            }
            if(isNaN(stock) || stock <= 0){
                throw new Error("El Stock debe ser un numero y mayor a 0")
            }
            const codeExist = await existingCode(code)
            if(codeExist){
                throw new Error("El Codigo proporcionado ya existe")
            }

            await createProduct(title, description, code, price, stock, status,category, thumbnails)

            const products = await getAllProducts();
            io.emit("getAllProducts", products); 
            res.redirect("realTimeProducts"); 
        }catch(error){
            next(error)
        }
    })

    //Ruta PUT para modificar un producto
    routerRealTimeProducts.put("/:pid", async (req,res)=>{
        try{
            const pId = req.params.pid;
            if (!(await validateId(pId))) {  
            throw new Error("El ID proporcionado no es valido");
        }

            const updateData = req.body
            if(!updateData || Object.keys(updateData).length === 0 || typeof updateData !== "object") {
                throw new Error("Los datos de actualización deben ser un objeto no vacio");
            }

            const productMod = await modProduct(pId, updateData)

            res.status(200).json({Mensaje: "Producto Modificado" , productMod})
        }catch(error){
            next(erro);
            
        }
    })

    //Ruta DELETE para eliminar un producto
    routerRealTimeProducts.delete("/:pid", async (req,res, next)=>{
        try{
            const pId = req.params.pid;
            if (!(await validateId(pId))) {  
                throw new Error("El ID proporcionado no es valido");
            }

            const productDelete = await deleteProduct(pId);
            if(!productDelete){
                throw new Error("No existe ningun producto con ID proporcionado")
            }

            const products =  await getAllProducts();
            
            io.emit("getAllProducts", {
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

            res.render("realTimeProducts", {
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
        }catch(error){
            next(error);
        }
    })

    return routerRealTimeProducts
}


