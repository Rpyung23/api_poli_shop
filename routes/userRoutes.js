const userController = require('../controllers/usersControllers');
//Para usar los JWT
const passport = require('passport');
module.exports = (app,upload)=>{
    
    //Get -> obtener daots
    //POST -> Almacenar datos
    //PUT -> Actualizar daots
    //DELETE -> Eliminar datos
    app.post('/api/users/create',userController.register) ;
    app.post('/api/users/login',userController.login) ;
    app.post('/api/users/createWithImage',upload.array('image',1),userController.registerWithImage);
    app.put('/api/users/update',passport.authenticate('jwt', {session: false}), upload.array('image',1),userController.updateWithImage);
    app.put('/api/users/updateWithoutImage',passport.authenticate('jwt', {session: false}),userController.updateWithoutImage);
}