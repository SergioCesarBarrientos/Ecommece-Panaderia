const Product = require('../models/products')  //Exporto Product que proviene de models

const obtenerProductos = async (req,res) =>{
    try{
         const productos = await Product.find(); //Guardo todos los productos en la variable productos que se va a renderizar en page/products
    res.render('page/products', {products : productos})
    }
    catch(error){
        console.log(error)
    }
   
};

const comprarProducto = async (req, res) =>{
    
    const idReq ={ id: req.params.id};

    let productos = await Product.findOne(idReq)
    .then(product =>{
        res.render('page/carrito', {product});

    })
    .catch(error =>{
        console.log(error)
    })
}






const agregarProducto = async (req, res) => {
 
    try {
        const idReq = req.params.id;
        const productos = await Product.findOne({id: idReq});

        let carrito = req.session.carrito || [];
        // Verifica si el producto ya esta en el carrito
        const productoEnCarrito = carrito.find(item => item.id === idReq);

        if (productoEnCarrito) {
            // Si ya está en el carrito, actualiza la cantidad o realiza otra acción
            // (por ejemplo, incrementar la cantidad)
            productoEnCarrito.cantidad++;
        } else {
            // Si no está en el carrito, agrégalo
            carrito.push({
                id: productos.id,
                nombre: productos.nombre,
                precio: productos.precio,
                descripcion: productos.descripcion,
                imagen: productos.imagen,
                cantidad: 1,
            });
        }
        
        req.session.carrito = carrito;


        res.redirect('/productos/productos'); 
        console.log ('se agrego el producto al carrito')
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al agregar el producto al carrito');
    }
};



const quitarProducto = async (req, res) => {
    const idReq = req.params.id; // Id del producto a quitar del carrito

    try {
    
        // Filtra el producto del carrito en la sesión
        req.session.carrito = req.session.carrito.filter(producto => producto.id !== idReq);
        console.log('Carrito actualizado:', req.session.carrito);


        console.log('Producto quitado del carrito');
        res.redirect('/carro'); 
    } catch (error) {
        console.error('Error al quitar producto del carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
};

    




module.exports = {
    obtenerProductos,
    comprarProducto,
    agregarProducto,
    quitarProducto,
}