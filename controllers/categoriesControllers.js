const Category = require('../models/category');

module.exports = {
    create(req,res){
        const category = req.body;
        Category.create(category, (err, id)=> {
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error en el registro de la categoria',
                    error: err
                });
            }

            return res.status(201).json({
               success: true,
               message: 'La categoria fue registrada',
               data: `${id}`
            });

        });
    },

    //CONTROLADOR PARA OBTENER LAS CATEGORIAS
    getAll(req, res){
        Category.getAll((err, data)=>{
            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al listar categorias',
                    error: err
                });
            }
            return res.status(201).json(data);
        });

    }
}