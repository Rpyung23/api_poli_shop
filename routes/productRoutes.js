const productsController = require('../controllers/productsControllers');
const passport = require('passport');

module.exports = (app,upload)=>{
    //GET -> OBTENER DATOS
    //POST -> ALMACENAR DATOS
    //PUT -> ACTUALIZAR DATOS
    //DELETE -> ELIMINAR DATOS
    app.post('/api/products/create', passport.authenticate('jwt',{ session: false}), upload.array('image',3), productsController.create);
    app.get('/api/products/findByCategory/:id_category', passport.authenticate('jwt',{ session: false}), productsController.findByCategory);
}

