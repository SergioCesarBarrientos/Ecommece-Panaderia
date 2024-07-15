const express =require('express');
const router = express.Router();
const {getProducts, favProduct, quitarFav} = require('../controllers/GetProducts')


router.route('/products').get(getProducts);

router.route('/favProducto/:id').post(favProduct); 

router.route('/quitarFavorito/:id').post(quitarFav);


module.exports = router;