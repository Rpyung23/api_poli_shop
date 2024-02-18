const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');

//Importar Rutas
const usersRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoryRoutes');
const productsRoutes = require('./routes/productRoutes');
//------//

const port = process.env.PORT || 8592;


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
app.disable('x-powered-by');
app.set('port',port);

//Metodo para almacenar imagenes
const upload = multer({
    storage: multer.memoryStorage()
});

//Llamado de las rutas
usersRoutes(app,upload); //El upload se aunmenta cuando hacemos la carga de imagenes
categoriesRoutes(app);
productsRoutes(app,upload);
//------//

server.listen(port,function(){
    console.log('Backend NodeJS ' + process.pid + ' Puerto: '+ port + ' Iniciando...')
});

app.get('/',(req,res)=>{
    res.send('Ruta raiz del backend');
});

//Manejo de error
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}
//200 respuesta exitosa
//404 url no existe
//500 error interno servidor- escrito mal 