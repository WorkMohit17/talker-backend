const mongoose = require('mongoose');
require("dotenv").config();


async function connectDB(){

    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected To DataBase") 
    }
    catch(err){
        console.log("Error in Connection to DB");
        console.log(err)
    }

}

module.exports = connectDB ;