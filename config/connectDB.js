const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const respuesta = await mongoose.connect(process.env.MONGO_URL);
        console.log('Se conecto la base de datos') 
    }

    catch(error){
        console.log(error)
    }

}

module.exports=connectDB