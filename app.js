const express = require('express');
const mustache = require('mustache-express');
const router = require('./routers/index')
const helpers = require('./helpers')
  

//Configuracoes
const app = express();

app.use((req,res, next)=> {
    res.locals.h = helpers;
    next();
})

app.use('/', router);

app.use(express.json());

app.engine('mst', mustache(__dirname+'/views/partials','.mst'));
app.set('view engine', 'mst')
app.set('views', __dirname + '/views');

module.exports = app;

