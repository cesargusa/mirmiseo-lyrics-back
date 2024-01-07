var connection = require('./connection/connection');
const express = require('express');
const app = express();
const userRoute = require('.//routes/UserRoutes')
const bodyParser = require('body-parser');

//Configuraciones
app.set('port',  3000);
app.set('json spaces', 2)
//Parseo json en los bodys
app.use(bodyParser.json());

//Rutas
app.use('/api/Users', userRoute);

//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});

//Conexion DB
connection.connect((err) =>{
  if (err) throw err;
  console.log('Conexion exitosa a la db');

})