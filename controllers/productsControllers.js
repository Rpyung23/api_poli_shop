const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');
module.exports = {
    create(req,res){
        const product = JSON.parse(req.body.product); //Capturar datos enviados por el cliente desde flutter - con imagen

        const files = req.files; //para capturar los archivos que vienen de flutter

        let inserts =0;
        if(files.length===0){
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el producto, no tiene imagenes',
            });
        }else{
            Product.create(product, (err,id_product)=>{
                if(err){
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del producto',
                        error: err
                    });
                }

                //NECESARIO PARA CARGAR LAS 3 IMAGENES -> USAMOS ASYNC_FOREACH
                product.id = id_product; //RECIBIMOS EL ID DEL PRODUCTO ANTES DE INGRESAR
                const start = async ()=> {
                    await asyncForEach(files,async (file)=>{
                        const path = `image_${Date.now()}`;
                        const url = await storage(file,path);

                        if(url != undefined && url!=null){ //se creo la imagen en firebase
                            if(inserts == 0) {//imagen1
                                product.image1 = url;
                            }else if (inserts == 1 ){
                                product.image2=url;
                            }else if(inserts == 2){
                                product.image3 = url;
                            }
                        }
                        await Product.update(product,(err, data)=>{
                            if(err){
                                return res.status(501).json({
                                    success: false,
                                    message: 'Hubo un error con el registro del producto',
                                    error: err
                                });
                            }
                            inserts = inserts+1;
                            if(inserts == files.length){//termino el ingreso de fotos del producto
                                return res.status(201).json({
                                    success: true,
                                    message: 'El producto se almaceno existosamente',
                                    data:  data //EL id del nuevo usuario que se registro
                                });
                            }
                        });
                    });
                }

                start();
            });
        }

    },

    //CONTROLADOR PARA OBTENER LAS CATEGORIAS
    findByCategory(req, res){
        const id_category = req.params.id_category;
        Product.findByCategory(id_category,(err, data)=>{
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