
const mongoose = require('mongoose');

require('dotenv').config({path:'variables.env'});


// connect to database
mongoose.connect(process.env.DATABASE, { 
    useNewUrlParser: true ,
     useUnifiedTopology: true,
     useFindAndModify: false
});
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error)=>{
    console.error("ERRO: "+error.message);
});

//Carrregando os models
require('./models/Post');

const app = require('./app');

app.set('port', process.env.PORT || 7777);

const server = app.listen(app.get('port'), ()=> {
    console.log("Servidor rodando na porta: "+server.address().port);
});