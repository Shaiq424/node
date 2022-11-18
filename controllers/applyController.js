const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();
var nodemailer =require("nodemailer");

exports.jobApplying = async(req,res,next) => {

    var date = new Date();
    try
    {
        const [rows] = await conn.execute('INSERT INTO `apply_job`(`candidate_id`, `candidate_name`, `job_id`, `job_applied`, `date_applied`) VALUES (?,?,?,?,?)',[
            req.body.candidate_id,
            req.body.candidate_name,
            req.body.job_id,
            req.body.job_applied,
            date
            ]);
    
        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "Successfully Applied For Job."
            });
        }
    }
    catch(err)
    {
        next(err);
    }
}

exports.getJobApplied = async (request, response) => {
    const [row] = await conn.execute('SELECT * FROM `apply_job`;');

    if(row.length > 0){
        return response.json({
            job:row
        });
    }

    response.json({
        message:"No Job found"
    });
    }

exports.updateJobApplied = async (request, response) => {
    var date = new Date();
    try
    {
        const [rows] = await conn.execute('UPDATE `apply_job` SET `contact`=?,`date_responded`=? WHERE id = ?;',
        [
            request.body.contact,
            date,
            request.body.id
        ]);
        const [email]=await conn.execute('SELECT `email` FROM users WHERE id = ?;',[request.body.id])

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'hirechoices@gmail.com',
              pass: 'hirechoices123'
            }
          });
        var mailOptions = {
            from: 'hirechoices@gmail.com',
            to: email[0].email,
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
        return response.status(201).json({
            message: "Responded Successfully."
        });
     
    }
    catch(err)
        {
            console.log(err)
        }
}

    exports.updateAppliedStatus = async (request, response) => {
        try
    {
        const [rows] = await conn.execute('UPDATE `apply_job` SET `status`=? WHERE id = ?;',
        [
            request.body.status,
            request.body.id
        ]);
    

        if (rows.affectedRows === 1) {
            return response.status(201).json({
                message: "Status Updated Successfully."
            });
        }
    }
    catch(err)
    {
        next(err);
    }
    }