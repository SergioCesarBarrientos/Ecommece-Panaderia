const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.MONGO_URL)

connect.then(() =>{
   console.log("Se conecto la base de datos");

})
.catch(() =>{
  console.log ("No se conecto la base de datos")
});

//crear un nuevo esquema - una colección nueva llamada users dentro de mi base de datos ya existente 

const usuarioSchema = new mongoose.Schema({

       username: {type: String, required: true},
       password: {type: String, required: true},
       email: {type: String, required: true}

});

const collection = mongoose.model("users", usuarioSchema);

module.exports= collection;