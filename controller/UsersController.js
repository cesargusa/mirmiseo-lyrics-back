// const mail = require('nodemailer/lib/mailer')
const connection = require('../connection/connection')

//GET ALL
exports.GetUsers = (req, res) => {
    try {
        const filters = [];
        const values = [];

        // Recoge los parámetros de la consulta
        const { city, country, IsVerified, IsConfirmed } = req.query;

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
        connection.query(query, values, (error, results) => {
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
        connection.query(sql, [email], (error, results) => {
            if (error) reject(error);
            else  resolve(results); 
        });
    });
};


exports.GetUsersByEmailApi = (req,res) => {
    const email = req.body.email;
    const sql = 'SELECT * FROM users WHERE Email = ?'
    connection.query(sql, [email], (error, results) => {
        if (error) {
            res.send('Ha fallado la consulta :(')
        } else res.send(results)

    })
}
exports.GetUsersByUserName = (req,res) => {
    const userName = req.body.UserName;
    const sql = 'SELECT * FROM users WHERE UserName = ?'
    connection.query(sql, [userName], (error, results) => {
        if (error) {
            res.send('Ha fallado la consulta :(')
        } else res.send(results)

    })
}
exports.GetUserById = (req, res) => {
    try {
        const userId = req.params.userId;
        const sql = 'SELECT * FROM users WHERE Id = ?'
        connection.query(sql, [userId], (error, results) => {
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
        connection.query(sql, [city], (error, results) => {
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
        connection.query(sql, [userName], (error, results) => {
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
        connection.query(sql, [email], (error, results) => {
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
            connection.query(sql, [Id,UserName, Password, NameUser, LastName, Email, Phone, UrlProfile, Creation_Date, Last_Connection, City, Country, IsConfirmed, IsVerified, UrlTwitter, Urlinstagram, UrlSpotify, IsOnline], (error) => {
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
        connection.query(sql,[email,password],async  (error, results ) =>{
            if(results[0].count > 0){
                var user  =  await this.GetUsersByEmail(email)
                console.log({id:user[0].Id,email:user[0].email,userName:user[0].userName})
                res.json({id:user[0].Id,email:user[0].Email,userName:user[0].UserName, message:"Login correcto"})
          
            }else  res.json({message:"Usuario y contraseña incorrectas"})
        })
    }else {
        res.json({message:"El usuario no existe"})
    }

}

