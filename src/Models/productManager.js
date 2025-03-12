const { error } = require("console");
const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4, validate: validateUUID } = require("uuid"); //Identificador unico para los ID de los productos

class ProductManager {
    constructor(){
        this.products = []
        this.filePath = path.join(__dirname, "../data/products.json");
    }
//Lee el archivo de productos
    async readProducts(){
        try{
            const data = await fs.readFile(this.filePath,"utf8")
            
            if(data.length === 0){
                throw new Error("El archivo de productos esta vacio")
            }
            this.products = JSON.parse(data)

            return{succes : "Archivo de productos cargado correctamente."}
        }catch(error){
            console.error("Error al cargar el archivo de productos", error.message)
            return { error: error.message };
        }
    }
//Guarda los productos en el archivo
    async saveProducts(){
        try{
            await fs.writeFile(this.filePath ,JSON.stringify(this.products, null, 2), "utf8");
            return {succes:"Productos guardados correctamente"}
        }catch(error){
            console.error("Error al guardar los productos", error.message)
            return { error: error.message };
        }
    }
//Valida que el parametro CODE no se repita (metodo creado para evitar la repeticion, facilitando el mantenimiento)
    async validateCode (code, id = null){
        const codeExist = this.products.some(p => p.code === code && p.id !== id);
        if(codeExist){
            throw new Error(`El codigo ${code} ya existe`)
        }
    }
//Busqueda de producto por su ID(Metodo creado para evitar la repeticion, facilitando el mantenimiento)
    async findProductById(id){
            if(!validateUUID(id)){
                throw new Error("El ID proporcionado no es valido");
            }

            const product = this.products.find(p => p.id === id)
            
            if(!product){
                throw new Error(`No existe ningun producto con ID ${id}`);
            }
            return product;
    }
//Crea un nuevo producto
    async createProduct(title, description, code, price, stock, status, category, thumbnails=[]){
        try{
            await this.readProducts();

            if (!title) throw new Error("El título es obligatorio");
            if (!description) throw new Error("La descripción es obligatoria");
            if (!code) throw new Error("El código es obligatorio");
            if (!price) throw new Error("El precio es obligatorio");
            if (!stock) throw new Error("El stock es obligatorio");
            if (!category) throw new Error("La categoría es obligatoria");
            if (!status) throw new Error("El status es obligatorio");

            if(isNaN(price) || price <= 0){
                throw new Error("El precio debe ser un numero y mayor a 0");
            }

            if(isNaN(stock) || stock <= 0){
                throw new Error("El Stock debe ser un numero y mayor a 0")
            }

            await this.validateCode(code);

            if (!Array.isArray(thumbnails)) {
                throw new Error( "Thumbnails debe ser un array");
            }

            let newId = uuidv4()

            let newProduct = {
                id : newId,
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails,
                status,
            }

            this.products.push(newProduct);
            await this.saveProducts();

            return newProduct;
            
        }catch(error){
            console.error("Error al intentar crear un nuevo producto", error.message)
            return { error: error.message }
        }
    }
//Muestra todos los productos
    async getAllProducts(){
        try{
            await this.readProducts();
            const products = this.products
            if(products.length === 0){
                throw new Error("No existen productos");
            }
            return products;
        }catch(error){
            console.error("Error al obtener la lista de productos", error.message)
            return { error: error.message }
        }
    }
//Muestra el producto filtrado por su ID
    async getProductById(id) {
        await this.readProducts(); 
        return this.findProductById(id); 
    }
//Borra un producto filtrado por su ID
    async deleteProduct(id){
        try{
            await this.readProducts();

            const product = this.products;

            if(!validateUUID(id)){
                throw new Error(`El ID ${id} no es valido`)
            }

            const productIndex = product.findIndex(p => p.id === id);
            if(productIndex === -1){
                throw new Error(`No existe ningun producto con ID ${id}`);
            }

            const [productRemoved] = product.splice(productIndex, 1);

            await this.saveProducts();
            return productRemoved;
        }catch(error){
            console.error("Error al eliminar un producto", error.message)
            return { error: error.message }
        }


    }
//Modifica un producto filtrado por su ID
    async modProduct(id, updateData){
        try{
            await this.readProducts();

            const modProduct = await this.findProductById(id)

            if(!updateData || Object.keys(updateData).length === 0 || typeof updateData !== "object") {
                throw new Error("Los datos de actualización deben ser un objeto no vacio");
            }

            if(updateData.code){
                await this.validateCode(updateData.code, id)
            }
    
            for (const key in updateData) {
                if (updateData.hasOwnProperty(key)) {
                    modProduct[key] = updateData[key];
                }
            }
    
            await this.saveProducts();
            return modProduct;
        }catch(error){
            console.error(`Ocurrio un error al modificar el producto con ID ${id}`, error.message);
            return { error: error.message }
        }
    }
}

module.exports= ProductManager;

