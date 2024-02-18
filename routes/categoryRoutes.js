const categoriesController = require('../controllers/categoriesControllers');
const passport = require('passport');

module.exports = (app)=>{
    //GET -> OBTENER DATOS
    //POST -> ALMACENAR DATOS
    //PUT -> ACTUALIZAR DATOS
    //DELETE -> ELIMINAR DATOS
    app.post('/api/categories/create', passport.authenticate('jwt',{ session: false}), categoriesController.create);
    app.get('/api/categories/getAll', passport.authenticate('jwt',{ session: false}), categoriesController.getAll);
}

