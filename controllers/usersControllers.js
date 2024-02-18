const User = require('../models/user');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys =require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {

    login(req,res){
      const email = req.body.email;
      const password = req.body.password;

      User.findByEmail(email, async (err,myUser)=>{
          if(err){
              return res.status(501).json({
                  success: false,
                  message: 'Hubo un error con el email usuario',
                  error: err
              });
          }

          if(!myUser){
              return res.status(401).json({ //El cliente no tiene autorizacion
                  success: false,
                  message: 'El email no fue encontrado',
                  error: err
              });
          }

          const isPasswordValid = await bcrypt.compare(password,myUser.password); //comparacion de las contraseñas encryptadas

          if(isPasswordValid){
              const token = jwt.sign({id:myUser.id, email: myUser.email}, keys.secretOrKey, {} );

              const data = {
                  id: `${myUser.id}`,
                  name: myUser.name,
                  lastname: myUser.lastname,
                  email: myUser.email,
                  phone: myUser.phone,
                  image: myUser.image,
                  session_token: `JWT ${token}`,
                  roles: myUser.roles
              }
              return res.status(201).json({
                  success: true,
                  message: 'El usuario fue autenticado',
                  data:  data //EL id del nuevo usuario que se registro
              });
          }else{
              return res.status(401).json({ //El cliente no tiene autorizacion
                  success: false,
                  message: 'El password no fue encontrado'
              });
          }

      });
    },

    register(req, res){
        const user = req.body; //Capturar datos enviados por el cliente
        User.create(user, (err,data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un erro con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo existosamente',
                data:  data //EL id del nuevo usuario que se registro
            });
        });
    },
    async registerWithImage(req, res){
        const user = JSON.parse(req.body.user); //Capturar datos enviados por el cliente desde flutter - con imagen

        const files = req.files; //para capturar los archivos que vienen de flutter

        if(files.length > 0 ){
            const path = `image_${Date.now()}`;
            const url = await storage(files[0],path);

            if(url != undefined && url!=null){
                user.image = url;
            }
        }

        User.create(user, (err,data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            user.id =`${data}`;
            const token = jwt.sign({id:user.id, email: user.email}, keys.secretOrKey, {} );
            user.session_token = token;

            //Para asignar un rol de usuario
            Rol.create(user.id, 3, (err, data)=>{
                if(err){
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del rol de usuario',
                        error: err
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizo existosamente',
                    data:  user //EL id del nuevo usuario que se registro
                });

            });


        });
    },

    //Metodo para actualizar los datos del usuario
    async updateWithImage(req, res){
        const user = JSON.parse(req.body.user); //Capturar datos enviados por el cliente desde flutter - con imagen

        const files = req.files; //para capturar los archivos que vienen de flutter

        if(files.length > 0 ){
            const path = `image_${Date.now()}`;
            const url = await storage(files[0],path);

            if(url != undefined && url!=null){
                user.image = url;
            }
        }

        User.update(user, (err,data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            User.findById(data, (err, myData)=>{
                if(err){
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del usuario',
                        error: err
                    });
                }
                //Para retornar el session token
                myData.session_token = user.session_token;
                //myData.roles = JSON.parse(myData.roles);
                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizo existosamente',
                    data:  myData //EL id del nuevo usuario que se registro
                });
            })


        });
    },

    //Metodo para actualizar sin imagen
    async updateWithoutImage(req, res){
        const user = req.body; //Capturar datos enviados por el cliente desde flutter - con imagen


        User.updateWithoutImage(user, (err,data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            User.findById(data, (err, myData)=>{
                if(err){
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del usuario',
                        error: err
                    });
                }
                //Para retornar el session token
                myData.session_token = user.session_token;
                //myData.roles = JSON.parse(myData.roles);
                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizo existosamente',
                    data:  myData //EL id del nuevo usuario que se registro
                });
            })




        });
    }
}