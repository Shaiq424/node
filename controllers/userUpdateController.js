const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();
exports.updateUser = async (request, response,next) => {
    try
{
    const [rows] = await conn.execute('UPDATE `users` SET `first_name`=?,`last_name`=?,`position_title`=?,`company_name`=?,`city`=?,`state`=?,`zip_code`=?,`phone`=?,`email`=? WHERE id = ?',
    [
        request.body.first_name,
        request.body.last_name,
        request.body.position_title,
        request.body.company_name,
        request.body.city,
        request.body.state,
        request.body.zip_code,
        request.body.phone,
        request.body.email,
        request.body.id
    ]);
    if (rows.affectedRows === 1) {
        return response.status(201).json({
            message: "The User has been successfully Updated."
        });
    }
}
catch(err)
{
    next(err);
}
}
exports.updateUserPassword = async (request, response,next) => {
try
{
    const password = await conn.execute('SELECT password FROM users where id = ?',[request.body.id])
    const validPassword = await bcrypt.compare(request.body.cpassword, password[0][0].password);
    if(validPassword === true)
    {
        const hashPass = await bcrypt.hash(request.body.password, 12);
    const [rows] = await conn.execute('UPDATE `users` SET `password`=? WHERE id = ?',
    [
        hashPass,
        request.body.id
    ]);
    if (rows.affectedRows === 1)
        {
            return response.status(201).json({
                message: "The User has been successfully Updated."
            });
        }
    }  
    else
        {
            return response.status(201).json({
                message: "Password Doesnt Match."
            });
        }
}
catch(err)
{
    next(err);
}
}