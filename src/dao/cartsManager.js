const fs = require("fs/promises");
const { v4: uuidv4, validate: validateUUID } = require("uuid"); //Identificador unico para los ID de los productos
const path = require ("path");


class CartManager {
    constructor(){
    this.filePath = this.filePath = path.join(__dirname,"../data/carts.json");
    this.carts = [];
    }

        //Leer archivo de carrito
    async readCarts() {
        try {
            const data = await fs.readFile(this.filePath, "utf-8");
            this.carts = JSON.parse(data);

            return{succes: "Archivo de carts cargado correctamente"}
        } catch (error) {
            console.error("Error al cargar el carrito desde el archivo:", error.message);
            return {error: error.message}
        }
    }

    //Gurdar el carrito en el archivo
    async saveCarts() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2), "utf-8");
            return {succes: "Carrito guardado correctamente"};
        } catch (error) {
            console.error("Error al guardar el carrito:", error.message);
            return {error: error.message};
        }
    }

    //Crear un nuevo carrito
    async createCart(){
        try{
            
        await this.readCarts();

        let newId = uuidv4();

        let newCart = {
            id : newId,
            products: [],
        }

        this.carts.push(newCart)

        await this.saveCarts()

        return {success: "Carrito creado correctamente", cart: newCart}
        }catch(error){
            console.error("Error al intentar crear un carrito", error.message);
            return {error: error.message};
        }
    }

    //Agrega producto al carrito con ID seleccionado
    async addProductToCart(cartId, productId){
        try{
            await this.readCarts();

            const cart = this.carts.find(cart => cart.id === cartId);

            const product = cart.products.find(p => p.product === productId)
            if(product){
                product.quantity += 1;
                console.log(`Producto con ID ${productId} actualizado. Nueva cantidad: ${product.quantity}`);
            }else{
                cart.products.push({
                    product: productId,
                    quantity: 1
                    })
                console.log(`Producto con ID ${productId} agregado con exito al carrito`)        
            }

            await this.saveCarts()
            return{success: "Producto agregado al carrito correctamente"}
        }catch(error){
            console.error("Error al agregar un producto al carrito", error.message);
            return{Error: error.message};
        }
    }

    //Lista los productos del carrito segun un ID
    async getCartById (id){
        try{
            await this.readCarts();

            let cartById = this.carts.find (c => c.id === id)
    
            return {success:"Carrito encontrado", cart: cartById}
        }catch(error){
            console.error("Error al listar los productos del Cart", error.message)
            return {error: error.message};
        }
    }
}

module.exports = CartManager;