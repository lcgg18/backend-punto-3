const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');


const app = express();


dbConnection();


app.use(cors());


app.use(express.static('public'));


app.use( express.json() );


app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader(
     "Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
   );
   res.setHeader(
     "Access-Control-Allow-Methods",
     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
   );
   next();
 });


app.use('/api/auth', require('./routes/auth'));





app.listen((process.env.PORT || 8000), () => {
    console.log(`Servidor corriendo en el puerto 8000`)
})