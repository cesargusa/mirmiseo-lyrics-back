var connection = require('./connection/connection');
const express = require('express');
const app = express();
const userRoute = require('.//routes/UserRoutes')
const bodyParser = require('body-parser');

//Configuraciones
app.set('port',  3000);
app.set('json spaces', 2)


app.use(bodyParser.json());
app.use('/api/Users', userRoute);

//Iniciando el servidor
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});


connection.connect((err) =>{
  if (err) throw err;
  console.log('Connected to the remote database!');

})