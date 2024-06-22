const connectDB = require('./config/connectDB');

const products = require('./models/products');

const productsJson = require ('./productos.json');

require('dotenv').config();

const iniciar = async () => {
   try{
    await connectDB ('mongodb://localhost:27017/')

    await products.create(productsJson)
    console.log('Se ejecuto el cambio');
   }

   catch(error){
    console.log(error)
   }
}

iniciar();