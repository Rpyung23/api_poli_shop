const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

//obtener usuarios por id para jwt
User.findById = (id,result)=>{
    const sql = `
        SELECT  CONVERT(U.id, char) AS id,U.email,U.name,U.lastname,U.image,U.phone,U.password, JSON_ARRAYAGG(
                JSON_OBJECT(
                        'id', CONVERT(R.id, char),
                        'name', R.name,
                        'image', R.image,
                        'route', R.route
                    )
                ) AS roles
        FROM users AS U
                 INNER JOIN user_has_roles UHR ON UHR.id_user = U.id
                 INNER JOIN roles AS R ON UHR.id_rol = R.id
        WHERE U.id = ?
        GROUP BY U.id
    `;

    db.query(
        sql,
        [id],
        (err, user) => {
            if (err) {
                console.log('Error: ', err);
                result(err, null);
            } else {
                console.log('Usuario Obtenido: ', user[0]);
                result(null, user[0]);
            }
        }
    );
}

//obtener usuarios por email para jwt
User.findByEmail = (email,result)=>{
    /*
        //Valido hasta que trabajemos con roles--
        const sql = `
        SELECT  id,email,name,lastname,image,phone,password
        FROM users
        WHERE email = ?
    `;*/
    const sql = `
                     
        SELECT  U.id,U.email,U.name,U.lastname,U.image,U.phone,U.password, JSON_ARRAYAGG(
            JSON_OBJECT(
                    'id', CONVERT(R.id, char),
                    'name', R.name,
                    'image', R.image,
                    'route', R.route
                )
            ) AS roles
        FROM users AS U
        INNER JOIN user_has_roles UHR ON UHR.id_user = U.id
        INNER JOIN roles AS R ON UHR.id_rol = R.id
        WHERE email = ?
        GROUP BY U.id
    `;

    db.query(
        sql,
        [email],
        (err, user) => {
            if (err) {
                console.log('Error: ', err);
                result(err, null);
            } else {
                console.log('Usuario Obtenido: ', user[0]);
                result(null, user[0]);
            }
        }
    );
}

User.create = async(user, result) => {

    //encriptar contraseña ingresada
    const hash = await bcrypt.hash(user.password, 10);

    const sql = `
        INSERT INTO users(email,name,lastname,phone,image,password,created_at,updated_at)
        VALUES(?,?,?,?,?,?,?,?)
    `;

    db.query(
        sql, 
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            hash,
            new Date(),
            new Date()
        ],
        (err, res) => {
            if (err) {
                console.log('Error: ', err);
                result(err, null);
            } else {
                console.log('Id del nuevo usuario: ', res.insertId);
                result(null, res.insertId);
            }
        }
    );
};

//Metodo que nos permite actualizar datos
User.update=(user,result) =>{
    const sql = `
        UPDATE
            users
        SET
            name = ?,
            lastname = ?,
            phone = ?,
            image = ?,
            updated_at = ?
        WHERE
            id = ?
    `;

    db.query(
        sql,
        [
            user.name,
            user.lastname,
            user.phone,
            user.image,
            new Date(),
            user.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error: ', err);
                result(err, null);
            } else {
                console.log('Usuario Actualizado ', user.id);
                result(null, user.id);
            }
        }
    );
}

//Metodo para actualizar sin imagen
User.updateWithoutImage=(user,result) =>{
    const sql = `
        UPDATE
            users
        SET
            name = ?,
            lastname = ?,
            phone = ?,
            updated_at = ?
        WHERE
            id = ?
    `;

    db.query(
        sql,
        [
            user.name,
            user.lastname,
            user.phone,
            new Date(),
            user.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error: ', err);
                result(err, null);
            } else {
                console.log('Usuario Actualizado ', user.id);
                result(null, user.id);
            }
        }
    );
}

module.exports = User;
