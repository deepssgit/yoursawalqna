const express = require("express")

const mongoose = require("mongoose")

require("dotenv").config()

const bodyParser=require("body-parser")

// image processing


////
  

const app = express()

app.use(express.static("questions"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine","ejs");

const mongostring = process.env.DATABASE_URL

mongoose.connect(mongostring,{useNewUrlParser: true},{useUnifiedTopology: true})

const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const routes = require("./routes/routes.js")

app.use("/",routes)

app.listen(3000,function(){
    console.log("server is running");
})
