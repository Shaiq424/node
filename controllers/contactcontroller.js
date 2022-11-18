const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();
exports.contactus = async(req,res,next) => {
    var date = new Date();
    try
    {
        const [rows] = await conn.execute('INSERT INTO `contact`(`first_name`, `last_name`, `company`, `contact_number`, `email`, `subject`) VALUES (?,?,?,?,?,?)',[
            req.body.first_name,
            req.body.last_name,
            req.body.company,
            req.body.contact_number,
            req.body.email,
            req.body.subject,
        ]);
        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "Details saved successfully."
            });
        }
    }
    catch(err)
    {
        next(err);
    }
}
exports.getcontact = async (request, response) => {
    const [row] = await conn.execute('SELECT * FROM `contact`;');
    if(row.length > 0){
        return response.json({
            job:row
        });
    }
    response.json({
        message:"No Contact found"
    });
    }