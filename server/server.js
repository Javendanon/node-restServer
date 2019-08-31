require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser')
const path = require ('path');
const soap = require('soap');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

// Configuración global de rutas
app.use(require('./routes/index'));

//habilitar el public

app.use(express.static(path.resolve(__dirname, '../public')));

app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto : `,process.env.PORT);
})
