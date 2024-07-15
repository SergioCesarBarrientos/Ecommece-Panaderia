const Product = require('../models/products')


const getProducts = async (req, res) => {
    const products = await Product.find();

    if (products) {
        res.render('page/products', { products: products, isAuth: req.session.isAuth })
    } else {
        res.json({ mensaje: "No hay productos" })
    }
};


const favProduct = async (req, res) => {

    try {
        const idReq = req.params.id;
        const productos = await Product.findOne({ id: idReq });

        let favoritos = req.session.favoritos || [];
        // Verifica si el producto ya esta en el carrito
        const productoEnFavoritos = favoritos.find(item => item.id === idReq);

        if (productoEnFavoritos) {
            console.log('El producto ya está en el carrito');
        } else {
            // Si no esta en favoritos, agrégalo
            favoritos.push({
                id: productos.id,
                nombre: productos.nombre,
                precio: productos.precio,
                descripcion: productos.descripcion,
                imagen: productos.imagen,
                cantidad: 1,
            });
        }

        req.session.favoritos = favoritos;


        res.redirect('/products');
        console.log('se agrego el producto a favoritos')
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar el producto a favoritos');
    }
};



const quitarFav = async (req, res) => {
    try {
        const idReq = req.params.id;
        console.log('idReq:', idReq);

        const producto = await Product.findOne({ id: idReq });
        console.log('Producto encontrado:', producto);

        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        let favoritos = req.session.favoritos;
        console.log('Favoritos antes de filtrar:', favoritos);

        // Filtra el producto de favoritos si ya está presente
        favoritos = favoritos.filter(item => item.id !== idReq);

        // Actualiza la sesión con los favoritos filtrados
        req.session.favoritos = favoritos;
        console.log('Favoritos actualizado:', req.session.favoritos);

        console.log('Se eliminó el producto de favoritos correctamente');

        // Redirige al usuario después de actualizar la sesión
        res.redirect('/favoritos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el producto de favoritos');
    }//
}; 




module.exports = { getProducts, favProduct, quitarFav }
