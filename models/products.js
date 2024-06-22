const mongoose = require('mongoose')

const productosSchema = new mongoose.Schema({


        id: Number,
        nombre: String,
        descripcion: String,
        precio: Number,
        imagen: String
       
});

const Product = mongoose.model('Product', productosSchema);

module.exports = Product;
//el modelo llamado productosSchema cambia a Product y va a ser exportado con ese nombre