//REQUERIR PAQUETES Y ARCHIVOS
const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/connectDB');
const productsRouter = require('./routes/products');
const mongoose = require('mongoose')
const users = require('./models/user')
const bcrypt = require("bcrypt"); // importo el paquete bcrypt que sirve para proporcionarme un hash
const session = require('express-session');
const MongoDBSession = require ('connect-mongodb-session')(session);


const mongoURI = "mongodb://localhost:27017/Panaderia";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}). then ((res)=>{
    console.log ("MongoDB conectado")
})

// Declarar store antes de usarlo en la configuración de session
const store = new MongoDBSession({
    uri: mongoURI,
    collection: "mySessions",
});


//MIDDLEWARE
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session
    ({secret: 'secret key', 
    resave: false,
    saveUninitialized: true,
    store: store,
     })
);


const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        res.redirect('/login')
    }
}


//REGISTER POST

app.post("/register", async (req, res) => {

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }


    try {//Uso una condicion que checkea que el email del usuario que se registre no se repita
        const usuarioExistente = await users.findOne({ email: data.email });
        if (usuarioExistente) {
            res.send("Este usuario ya está registrado. Por favor elija otro.");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);  //con el hash proporcionado por el bcrypt la contraseña es privada
        data.password = hashedPassword;

        const userData = await users.insertMany(data);
        console.log(userData)


        console.log("Usuario Registrado:", data.email);
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.redirect("/register");
    }
});

//LOGIN POST

app.post("/login", async (req, res) => {

    const {email, password} = req.body; 

        const user = await users.findOne({ email });

        if (!user) {
         
            return res.redirect("/login");
        }

        const contraseñaCoincide = await bcrypt.compare(password, user.password);
        if (contraseñaCoincide) {
            console.log("Inicio de sesion exitoso!")
            
        } else {
            console.log("Contraseña incorrecta")
          
            return res.redirect("/login");
        }

    req.session.isAuth = true;
    res.redirect("/home");
    
});

app.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) throw error;
        console.log("Cierre de sesion exitoso!")
        res.redirect("/login");
    });
});


//RUTAS GET

app.get('/', (req, res) => {
    res.render('page/home', {
        isAuth: req.session.isAuth})
});

app.get('/home', (req, res) =>{
res.render('page/home', {isAuth: req.session.isAuth})
});

app.get('/about', (req, res) => {
    res.render('page/about', {
        isAuth: req.session.isAuth})
});

app.get('/contact', (req, res) => {
    res.render('page/contact', {
        isAuth: req.session.isAuth})
});


app.get('/login', (req, res) => {
    res.render('page/login', {
        isAuth: req.session.isAuth})
});

app.get('/register', (req, res) => {
    res.render('page/register', {
        isAuth: req.session.isAuth})
});


app.get('/favoritos', (req, res) => {
    if (req.session.isAuth) {
         res.render('page/favoritos', {
             isAuth: req.session.isAuth,
             favoritos: req.session.favoritos || []
         });
    } else {
         
        res.redirect('/login'); 
     }
 });

app.get('/products-cart', (req, res)=>{
    res.render("page/products-cart" , { isAuth: req.session.isAuth})
});

/*ruta get para obtener los productos*/
app.get("/products", productsRouter);

/*ruta post para agregar un producto a favoritos*/ 
app.post("/favProducto/:id", isAuth, productsRouter);

/*ruta para quitar un producto de favoritos*/
app.post("/quitarFavorito/:id", isAuth, productsRouter);


const iniciar = async () => {

    try {
        await connectDB(process.env.MONGO_URL)
    }
    catch (error) {
        console.log(error)
    }
}

iniciar();

//PUERTO

app.listen(process.env.PORT, () => {
    console.log("el puerto funciona");
});