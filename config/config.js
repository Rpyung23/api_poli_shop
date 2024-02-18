const mysql = require('mysql2');
const db = mysql.createConnection({
    host: "159.223.111.107",
    user: "root",
    database: "plus_promo",
    password: "Pum@15001232023*",
    port: 3306
});

db.connect(function(err){
    if(err) {
        throw err;
    }
    console.log('DATABASE CONNECTED!!')
});
module.exports = db;