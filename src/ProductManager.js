const fs = require('fs');
const path = require('path');

class ProductManager{
    
    static last_id = 0;

    constructor(filePath){
        this.filePath = filePath;
        this.products = [];
    }
    
    loadProducts() {
        try {
            const fileData = fs.readFileSync(this.filePath, 'utf-8');
            this.products = JSON.parse(fileData);
            this.lastId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
        } catch (error) {
            this.products = [];
            this.lastId = 0;
        }
    }
    
    getProducts(){
        console.log(this.products);
        return this.products;
    }

    getProductById(id){        
        const product = this.products.find((product) => product.id === id);
        if (product) {
            console.log(product)
            return product;
        } else {
            console.error("Not found");
        }
    }
    
    updateProduct(id, updateData) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const updatedProduct = { ...this.products[productIndex], ...updateData, id };
            this.products[productIndex] = updatedProduct;
            this.saveProducts();
            return updatedProduct;
        }
        return null;
    }
    
    saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.filePath, data);
    }
    
    addProduct(title, description, price, thumbnail, code, stock){
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }
        if (this.products.some((product) => product.code === code)) {
            console.error("Ya existe un producto con ese código");
            return;
        }
        ProductManager.last_id ++;
        const product={
            id: ProductManager.last_id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
        };
        this.products.push(product);
        this.saveProducts();
        console.log("Producto agregado:", product);
        return product;
    }
    
    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            this.saveProducts();
            return true;
        }
        return false;
    }
}
module.exports = ProductManager;

const productManager = new ProductManager(path.join('./productos.json'));
productManager.addProduct(
    "Producto 1",
    "Descripción del producto 1",
    10.99,
    "ruta/a/la/imagen1.jpg",
    "CODE001",
    5
);
  
productManager.addProduct(
    "Producto 2",
    "Descripción del producto 2",
    99,
    "ruta/a/la/imagen2.jpg",
    "CODE002",
    5
);
const allProducts = productManager.getProducts();
console.log('Todos los productos:', allProducts);

const productIdToFind = 1;
const foundProduct = productManager.getProductById(productIdToFind);
console.log(`Producto con id ${productIdToFind}:`, foundProduct);
    
const productIdToUpdate = 1;
const updateData = {
    title: 'Producto 1 actualizado',
    price: 19.99,
    stock: 5
};
const updatedProduct = productManager.updateProduct(productIdToUpdate, updateData);
console.log('Producto actualizado:', updatedProduct);

const productIdToDelete = 5;
const deleteResult = productManager.deleteProduct(productIdToDelete);
if (deleteResult) {
    console.log(`Producto con id ${productIdToDelete} eliminado`);
} else {
    console.log(`No se encontró un producto con id ${productIdToDelete}`);
}

