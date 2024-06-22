const express =require('express');
const router = express.Router();
const {obtenerProductos, comprarProducto, agregarProducto, quitarProducto, productoComprado} = require('../controllers/products')



router.route('/productos').get(obtenerProductos);

router.route('/comprarProducto/:id').get(comprarProducto);

router.route('/agregarProducto/:id').post(agregarProducto); 

router.route('/quitarProducto/:id').post(quitarProducto); 


module.exports = router;