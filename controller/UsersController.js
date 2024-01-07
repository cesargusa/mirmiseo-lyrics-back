// const mail = require('nodemailer/lib/mailer')
const connection = require('../connection/connection')
// const UserSEmailPasswordDTO = require('../DTO/Users/UsersEmailPasswordDTO.ts')



//GET ALL
exports.GetUsers = (req, res) => {
    try {
        const filters = [];
        const values = [];

        // Recoge los parámetros de la consulta
        const { city, country, IsVerified, IsConfirmed } = req.query;

        // Agrega condiciones y valores a los arrays según la presencia de los parámetros
        if (city) {
            filters.push('city = ?');
            values.push(city);
        }

        if (country) {
            filters.push('country = ?');
            values.push(country);
        }

        if (IsVerified) {
            filters.push('IsVerified = ?');
            values.push(IsVerified);
        }

        if (IsConfirmed) {
            filters.push('IsConfirmed = ?');
            values.push(IsConfirmed);
        }

        // Construye la consulta SQL
        let query = 'SELECT * FROM users';
        if (filters.length > 0) {
            query += ' WHERE ' + filters.join(' AND ');
        }

        // Ejecuta la consulta SQL
        connection.query(query, values, (error, results, fields) => {
            if (error) {
                res.send('Ha fallado la consulta :(');
            } else {
                res.send(results);
            }
        });
    } catch (error) {
        res.status(500).send(`Ocurrió un error interno en el servidor - ${error}`);
    }
};
exports.GetUsersByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE Email = ?';
        connection.query(sql, [email], (error, results, fields) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(results);  // Resolver con el arreglo completo de resultados
            }
        });
    });
};


exports.GetUsersByEmailApi = (req,res) => {
    const email = req.body.email;
    const sql = 'SELECT * FROM users WHERE Email = ?'
    connection.query(sql, [email], (error, results, fields) => {
        if (error) {
            res.send('Ha fallado la consulta :(')
        } else res.send(results)

    })
}
exports.GetUsersByUserName = (req,res) => {
    const userName = req.body.UserName;
    const sql = 'SELECT * FROM users WHERE UserName = ?'
    connection.query(sql, [userName], (error, results, fields) => {
        if (error) {
            res.send('Ha fallado la consulta :(')
        } else res.send(results)

    })
}
exports.GetUserById = (req, res) => {
    try {
        const userId = req.params.userId;
        const sql = 'SELECT * FROM users WHERE Id = ?'
        connection.query(sql, [userId,city], (error, results, fields) => {
            if (error) {
                res.send('Ha fallado la consulta :(')
            } else res.send(results)

        })
    } catch (error) {
        res
            .status(500)
            .send(`Ocurrió un error interno en el servidor - ${error}`);
    }
}
exports.GetUserByCity = (req, res) => {
    try {
        const city = req.params.city;
        const sql = 'SELECT * FROM users WHERE City = ?'
        connection.query(sql, [city], (error, results, fields) => {
            if (error) {
                res.send('Ha fallado la consulta :(')
            } else res.send(results)

        })
    } catch (error) {
        res
            .status(500)
            .send(`Ocurrió un error interno en el servidor - ${error}`);
    }
}
exports.IfExistUserName = (userName) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(UserName) AS count FROM users WHERE UserName = ?';
        connection.query(sql, [userName], (error, results, fields) => {
            if (error) {
                reject('Ha fallado la consulta :(');
            } else {
                const count = results[0].count;
                resolve(count > 0);
            }
        });
    });
};
exports.IfExistEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(Email) AS count FROM users WHERE Email = ?';
        connection.query(sql, [email], (error, results, fields) => {
            if (error) {
                reject('Ha fallado la consulta :(');
            } else {
                const count = results[0].count;
                resolve(count > 0);
            }
        });
    });
};
exports.Register = async (req, res) => {
    try {
        const existsUser = await this.IfExistUserName(req.body.UserName);
        const existsEmail = await this.IfExistEmail(req.body.Email);
        const {Id,UserName,Password,NameUser,LastName,Email,Phone,UrlProfile,Creation_Date,Last_Connection,City,Country,IsConfirmed,IsVerified,UrlTwitter,Urlinstagram,UrlSpotify,IsOnline} = req.body
        const sql = 'INSERT INTO users (Id,UserName, Password, NameUser, LastName, Email, Phone, UrlProfile, Creation_Date, Last_Connection, City, Country, IsConfirmed, IsVerified, UrlTwitter, UrlInstagram, UrlSpotify, IsOnline) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
        if (existsUser || existsEmail) res.json({ exists: true });
        else {
            connection.query(sql, [Id,UserName, Password, NameUser, LastName, Email, Phone, UrlProfile, Creation_Date, Last_Connection, City, Country, IsConfirmed, IsVerified, UrlTwitter, Urlinstagram, UrlSpotify, IsOnline], (error, results, fields) => {
                if (error) res.json({ "message": "Fallo la consulta" });
                else res.json({ "message": "Usuario " + UserName +"creado correctamente" });
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};
exports.Login = async (req,res) => {
    const email = req.body.email;
    console.log(email)
    const password = req.body.password;
    const existsEmail = await this.IfExistEmail(email);

console.log(existsEmail)
    if(existsEmail){
        const sql = 'SELECT COUNT(EMAIL) AS count FROM users WHERE Email = ? AND Password = ? ';
        connection.query(sql,[email,password],async (error, results, fields ) =>{
            if(results[0].count > 0){
                var user =  await this.GetUsersByEmail(email)
                console.log({id:user[0].Id,email:user[0].email,userName:user[0].userName})
                res.json({id:user[0].Id,email:user[0].Email,userName:user[0].UserName, message:"Login correcto"})
          
            }else  res.json({message:"Usuario y contraseña incorrectas"})
        })
    }else {
        res.json({message:"El usuario no existe"})
    }

}

// //CREATE
// exports.CreateUser = (req, res) => {
//     const { idUser, Email, UserName, Password, CreateDate, LastConnection, IsActive } = req.body;
//     const sqlCheck = 'SELECT COUNT(*) as count FROM users WHERE UserName = ? OR Email = ?'
//     sql = 'INSERT INTO users VALUES (?, ?, ?,?,?,?,?)'
//     connection.query(sqlCheck, [req.body.UserName, req.body.Email], (err, result) => {
//         if (err) throw err
//         if (result[0].count > 0) {
//             res.status(400).send('El UserName o el Email ya existe');
//         } else {
//             QueryInsert()
//             var titulo = 'Autobuses Zaragoza Cuenta Creada'
//             var mensaje = `
//             <span>Enhorabuena, se ha registrado correctamente en la Web de Autobuses Zaragoza</span>
//             <br>
//             <span>Nombre de Usuario: <span><strong>${UserName}</strong></span></span><br>
//             <span>Correo Electrónico: <span><strong>${Email}</strong></span></span><br>
//             <span>Contraseña: <span><strong>${Password}</strong></span></span>
//             <br>
//             <br>
//             <a href='${sitioEnviroment.DIRECCIONES.SITIO}'>Inicia sesión desde aquí</a>
//             `
//             var mailOptionsRegister = {
//                 from: sitioEnviroment.ENVIROMENTMAIL.USEREMAIL,
//                 to: Email,
//                 subject: titulo,
//                 html: mensaje,
//               };
//             mail(mailOptionsRegister)
//             console.log(mailOptionsRegister)
//         }
//     }
//     )
//     function QueryInsert() {

//         try {
//              connection.query(sql, [idUser, Email, UserName, Password, CreateDate, LastConnection, IsActive], (err, result) => {
//             if (err) throw err
//             console.log(`Nuevo registro insertado en la tabla: ${result.insertId}`)
//             res.json({ message: 'Registro insertado correctamente' });

//         })
//         } catch (error) {
//             res.status(500).send(`Ocurrió un error interno en el servidor - ${error}`);
//         }
       
//     }
// }
// exports.UpdatePasswordUser = (req,res) => {

//     try {
//            const idUser = req.params.idUser
//     const password = req.body.Password
//     const sql = 'UPDATE users SET Password = ? WHERE IdUser = ?'
//     connection.query(sql, [password, idUser], (err, result) =>{
//         if(err) throw err
//         if(result.affectedRows === 0) res.status(404).send('No se encontro al usuario')
//         else res.json({message:`Contraseña de Usuario ${idUser} actualizada correctamente`})
//     })
//     } catch (error) {
//         res.status(500).send(`Ocurrió un error interno en el servidor - ${error}`);

//     }
 
// }

// //DELETE

// exports.DeleteUser = (req,res) =>{
//   try {
//     const { idUser } = req.params;
//     const sqlDelete = "DELETE FROM users WHERE IdUser = ?";

//     connection.query(sqlDelete, [idUser], (err, result) => {
//       if (err) throw err;
//       if (result.affectedRows === 0)
//         res.status(404).send("No se encontró el usuario especificado");
//       else res.send(`Usuario con id: ${idUser} eliminado correctamente`);
//     });
//   } catch (error) {
//     res.status(500).send(`Ocurrió un error interno en el servidor - ${error}`);
//   }
// }

// //UPDATE CONNECTION

// exports.UpdateUser = (req, res) => {

//     try {
//         const idUser = req.params.idUser
//         const lastConnection = req.body.LastConnection
//         const sql = 'UPDATE users SET LastConnection = ? WHERE IdUser = ?'
//         connection.query(sql, [lastConnection, idUser], (err, result) =>{
//             if(err) throw err
//             if(result.affectedRows === 0) res.status(404).send('No se encontro al usuario')
//             else res.json({message:`Usuario ${idUser} actualziado correctamente`})
//         })
//     } catch (error) {
//         res.status(500).send(`Ocurrió un error interno en el servidor - ${error}`)
//     }

// }

// //DELETE USER IsActive

// exports.DeleteUserIsActive = (req,res) =>{

//     try {
//         const idUser = req.params.idUser
//         const isActive = req.body.IsActive
//         const sql = 'UPDATE users SET IsActive = ? WHERE IdUser = ?'
//         connection.query(sql, [isActive, idUser], (err, result) =>{
//             if(err) throw err
//             if(result.affectedRows === 0) res.status(404).send('No se encontro al usuario')
//             else res.json({message:`Usuario ${idUser} ha sido eliminado correctamente`})
//         })
//     } catch (error) {
//         res.status(500).send(`Ocurrió un error interno en el servidor - ${error}`)
//         }

// }

// //Iniciar Sesion
// exports.Login = (req,res) =>{

//     try{
//         const {email,password} = req.body
//         const sql = 'SELECT * FROM users WHERE (Email = ? OR UserName = ?) AND Password = ?'
//         connection.query(sql,[email,email,password], (error,results,fields) =>{
//             if(error) throw error
//             if(results.length > 0 && results[0].IsActive === 1){
//                 console.log(results)
//                 const userName = results[0].UserName
//                 const idUser = results[0].IdUser
//                 res.json({succes:true, userName, idUser, isActive:results[0].IsActive})
//             }else if(results.length > 0 && results[0].IsActive === 0) res.json({succes:false, isActive: results[0].IsActive })
//             else res.json({succes:false })
//         })
//     }
//     catch(error){
//         res.status(500).send(`Ocurrió un error interno en el servidor - ${error}`)
//     }
   
// }