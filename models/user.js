const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({

       username: {type: String, required: true},
       password: {type: String, required: true},
       email: {type: String, required: true},

});


const users = mongoose.model("users", usuarioSchema);

module.exports= users;