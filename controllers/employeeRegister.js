const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();


exports.registered = async(req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(422).json({ errors: errors.array() });
    }

    try
    {

      
if(req.body.password !== null){
    const [row] = await conn.execute(
        "SELECT `email` FROM `users` WHERE `email`=?",
        [req.body.email]
      );

    if (row.length > 0) {
        return res.status(201).json({
            message: "The E-mail already in use",
        });
    }
    const hashPass = await bcrypt.hash(req.body.password, 12);
    const [rows]=await conn.execute('INSERT INTO `users`(`first_name`, `last_name`, `position_title`, `company_name`, `city`, `state`, `zip_code`, `phone`, `email`, `password`,`role`,`create_posting`,`resume_info`,`billing_info`,`employer_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[
        req.body.first_name,
        req.body.last_name,
        req.body.position_title,
        req.body.company_name,
        req.body.city,
        req.body.state,
        req.body.zip_code,
        req.body.phone,
        req.body.email,
        hashPass,
        req.body.role,
        req.body.create_posting,
        req.body.resume,
        req.body.billing,
        req.body.employer_id
    ]);


    if (rows.affectedRows === 1) {
        return res.status(201).json({
            message: "The user has been successfully inserted.",
        });
    }

    }
    }
    catch(err)
    {
        next(err);
    }
}