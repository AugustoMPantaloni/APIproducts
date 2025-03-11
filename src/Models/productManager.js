const { error } = require("console");
const fs = require("fs/promises");

class ProductManager {
    constructor(){
        this.products = []
        this.filePath = "./data/products.json"
    }

    async readProducts(){
        try{
            const data = await fs.readFile(this.filePath,"utf8")
            
            if(data.length === 0){
                throw new Error("El archivo de productos esta vacio")
            }

            return{succes : "Archivo de productos cargado correctamente."}
        }catch(error){
            console.error("Error al cargar el archivo de productos", error.message)
        }
    }

    async saveProducts(){
        try{
            await fs.writeFile(this.filePath ,this.products, "utf8")
            return {succes:"Productos guardados correctamente"}
        }catch(error){
            console.error("Error al guardar los productos", error.message)
        }
    }

    async createProduct(title, description, code, price, stock, category, thumbnails=[]){
        try{
            await this.readProducts();

            if (!title) throw new Error("El título es obligatorio");
            if (!description) throw new Error("La descripción es obligatoria");
            if (!code) throw new Error("El código es obligatorio");
            if (!price) throw new Error("El precio es obligatorio");
            if (!stock) throw new Error("El stock es obligatorio");
            if (!category) throw new Error("La categoría es obligatoria");

            if(isNaN(price)){
                throw new Error("El precio debe ser un numero");
            }

            if(this.products.some (p => p.code === code)){
                throw new Error( `El codigo ${code} ya esta en uso`);
            };

            if (!Array.isArray(thumbnails) || thumbnails.length === 0) {
                throw new Error( "Thumbnails debe ser un array no vacio");
            }

            let newId = this.products.length > 0 
            ? Math.max(...this.products.map(product => Number(product.id))) + 1 
            : 1;

            let newProduct = {
                id : newId,
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails
            }

            this.products.push(newProduct);
            await this.saveProducts();

            return newProduct;
            
        }catch(error){
            console.error("Error al intentar crear un nuevo producto", error.message)
        }
    }

    async getAllProducts(){
        try{
            const products = this.products
            if(products.length === 0){
                throw new Error("No existen productos");
            }
            return products;
        }catch(error){
            console.error("Error al obtener la lista de productos", error.message)
        }
    }

    async getProductById(id){
        try{
            await this.readProducts();
            
            const products = this.products;

            const productById = products.find(p=> p.id === id);
            if(!productById){
                throw new Error(`No existe ningun producto con el ID ${id}`)
            };
            return productById;
        }catch(error){
            console.error("Error al obtener el producto", error.message)
        }
    }

    async deleteProduct(id){
        try{
            await this.readProducts();

            const product = this.products;

            const productIndex = product.findIndex(p => p.id === id);
            if(productIndex === -1){
                throw new Error(`No existe ningun producto con ID ${id}`);
            }

            const [productRemoved] = product.splice(productIndex, 1);

            await this.saveProducts();
            return productRemoved;
        }catch(error){
            console.error("Error al eliminar un producto", error.message)
        }


    }

    async modProduct(){}
}


