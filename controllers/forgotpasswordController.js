const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
exports.getEmail = async (request, response) => {
    const [row] = await conn.execute('SELECT * FROM `users` where email = ?;',[request.body.email]);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hirechoices@gmail.com',
            pass: 'hirechoices123'
        }
      });
    //   row[0]['password']
    //   request.body.email
    var mailOptions = {
        from: 'hirechoices@gmail.com',
        to: request.body.email,
        subject: 'Forgot Password',
html: '<a href="https://hirechoicesf.scoopsolutions.us/forgot-password">Click Here</a>'
      };
      transporter.sendMail(mailOptions, function(error, info)
      {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    if(row.length > 0){
      return response.json({
         message:"successful",
         email:request.body.email,
         hash:row[0]['password']
      });
  }
  response.json({
      message:"No user found"
  });
}
exports.forgotPassword = async(req,res,next) => {
    var date = new Date();
    try
    {
      const [password] = await conn.execute('SELECT * FROM users where email = ?',[req.body.email]);
      if(password[0]['password'] == req.body.hash)
      {
        const hashPass = await bcrypt.hash(req.body.password, 12);
        const [rows] = await conn.execute('update users set password = ? where email = ?',[
          hashPass,
          req.body.email
        ]);
        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "Password Change Successfully."
            });
        }
      }
      else
      {
        res.json({
          message:"Failed"
      });
      }
    }
    catch(err)
    {
        next(err);
    }
  }