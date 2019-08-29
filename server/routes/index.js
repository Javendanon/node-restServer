const express = require('express');
const app = express();

app.use(require('./rest'));


module.exports = app;