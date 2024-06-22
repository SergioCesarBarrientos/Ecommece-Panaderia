//REQUERIR PAQUETES Y ARCHIVOS
const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/connectDB');
const productsRouter = require('./routes/products')
const bcrypt = require("bcrypt") // importo el paquete bcrypt que sirve para proporcionarme un hash
const collection = require("./models/user")
const session = require('express-session');


//MIDDLEWARE
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: '12345', 
    resave: false,
    saveUninitialized: true
}));



app.use('/productos', productsRouter);





//REGISTER 

app.post("/register", async (req, res) => {

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }


    try {//Uso una condicion que checkea que el email del usuario que se registre no se repita
        const usuarioExistente = await collection.findOne({ email: data.email });
        if (usuarioExistente) {
            res.send("Este usuario ya está registrado. Por favor elija otro.");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);  //con el hash proporcionado por el bcrypt la contraseña es privada
        data.password = hashedPassword;

        const userData = await collection.insertMany(data);
        console.log(userData)


        console.log("Usuario Registrado:", data.email);
        res.redirect("/login");
    } catch (error) {
        console.log(error);
        res.redirect("/register");
    }
});


//LOGIN

app.post("/login", async (req, res) => {

    
    try {
        const check = await collection.findOne({email: req.body.email });
        if (!check) {
            res.send("El usuario no pudo ser encontrado")
        }

        const contraseñaCoincide = await bcrypt.compare(req.body.password, check.password);
        if (contraseñaCoincide) {
            console.log("Inicio de sesion exitoso!")
            res.render("page/home")
        } else {
            console.log("Contraseña incorrecta")
            res.send("Contraseña Incorrecta")
        }


    } catch (error) {
        console.log(error)
        res.send("Error al procesar la solicitud")

    }

});

//RUTAS GET

app.get('/', (req, res) => {
    res.render('page/home')
});

app.get('/about', (req, res) => {
    res.render('page/about')
});

app.get('/contact', (req, res) => {
    res.render('page/contact')
});


app.get('/login', (req, res) => {
    res.render('page/login')
});

app.get('/register', (req, res) => {
    res.render('page/register')
});


app.get('/carro', (req, res) => {
    res.render('page/carro', { carrito: req.session.carrito || [] });
});


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