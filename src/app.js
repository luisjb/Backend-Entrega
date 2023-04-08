const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const ProductManager = require('./ProductManager'); 

const PUERTO = 8080;
const servidor = express();

const productManager = new ProductManager(path.join('./productos.json'));

servidor.get('/products',async (req, res) => {
    try {
        await productManager.loadProducts();
        let products = productManager.getProducts();
        if (req.query.limit) {
            products = products.slice(0, parseInt(req.query.limit));
        }
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});

servidor.get('/products/:pid',async (req, res) => {
    try {
        await productManager.loadProducts();
        const product = productManager.getProductById(parseInt(req.params.pid));
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el producto');
    }
});

servidor.listen(PUERTO, () =>{
    console.log(`Servidor express activo en puerto ${PUERTO}`)
})