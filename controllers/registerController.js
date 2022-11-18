const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();
const jwt = require('jsonwebtoken');
var nodemailer=require("nodemailer")


exports.register = async(req,res,next) => {
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
    const [rows]=await conn.execute('INSERT INTO `users`(`first_name`, `last_name`, `position_title`, `company_name`, `city`, `state`, `zip_code`, `phone`, `email`, `password`,`source`,`role`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[
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
        req.body.source,
        req.body.role
    ]);

 
    const [user] = await conn.execute('select * from `users` where `email` = ?',[req.body.email]);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hirechoices@gmail.com',
          pass: 'hirechoices123'
        }
      });
    var mailOptions = {
        from: 'hirechoices@gmail.com',
        to: req.body.email,
        subject: 'Successfully Register',
        text: 'That was easy!'
      };
      transporter.sendMail(mailOptions, function(error, info)
      {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      if (rows.affectedRows === 1) {
        return res.status(201).json({
            message: "The user has been successfully inserted.",
        });
    }
    if(user.length > 0){
        return res.json({
            user:user
        });
    }

    }
    else{
  const [row] = await conn.execute(
            "SELECT * FROM `users` WHERE `email`=?",
            [req.body.email]
          );
          console.log("fff",row[0]['id'])
          const theToken = jwt.sign({id:row[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });

        if (row.length > 0) {
            return res.status(201).json({
                user:row[0],
                resume:row[0]['id'],
                token:theToken
                
            });

        }
        else
        {
        const [rows]=await conn.execute('INSERT INTO `users` (`first_name`, `last_name`,`email`,`source`,`role`) VALUES (?,?,?,?,?)',[
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            req.body.source,
            req.body.role
        ]);
        const [user] = await conn.execute('select * from `users` where `email` = ?',[req.body.email]);
        const theToken = jwt.sign({id:user[0].id},'the-super-strong-secrect',{ expiresIn: '3h' });

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "The user has been successfully inserted.",user:user, resume: user['id'],
                token:theToken

            });
        }
    }
    }

    
      
        
    }
    catch(err)
    {
        next(err);
    }
}