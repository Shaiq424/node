const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();

exports.billingPosting = async(req,res,next) => {

    var date = new Date();
    try
    {
        const [rows] = await conn.execute('INSERT INTO `billing_information`(`user_id`,`first_name`, `last_name`, `company_name`, `billing_email`, `phone`, `fax`, `address_1`, `address_2`, `city`, `state`, `zip`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[
            req.body.userid,
            req.body.first_name,
            req.body.last_name,
            req.body.company_name,
            req.body.billing_email,
            req.body.phone,
            req.body.fax,
            req.body.address_1,
            req.body.address_2,
            req.body.city,
            req.body.state,
            req.body.zip
        ]);
        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "The billing has been successfully inserted."
            });
        }
    }
    catch(err)
    {
        next(err);
    }
}

exports.getbilling = async (request, response) => {
    const [row] = await conn.execute('SELECT * FROM `billing_information`;');

    if(row.length > 0){
        return response.json({
            job:row
        });
    }

    response.json({
        message:"No Billing found"
    });
    }

    exports.getbillingsbyId = async (request, response) => {
        const [row] = await conn.execute('SELECT * FROM `billing_information` where user_id = ?',[request.params.id]);

        if(row.length > 0){
            return response.json({
                billing:row
            });
        }
    
        response.json({
            message:"No billing found"
        });
    }

    exports.updatebilling = async (req, response,next) => {
        try
    {
        const [rows] = await conn.execute('UPDATE `billing_information` SET `first_name`=?,`last_name`=?,`company_name`=?,`billing_email`=?,`phone`=?,`fax`=?,`address_1`=?,`address_2`=?,`city`=?,`state`=?,`zip`=? WHERE id = ?;',
        [
            req.body.first_name,
            req.body.last_name,
            req.body.company_name,
            req.body.billing_email,
            req.body.phone,
            req.body.fax,
            req.body.address_1,
            req.body.address_2,
            req.body.city,
            req.body.state,
            req.body.zip,
            req.body.id
        ]);
    

        if (rows.affectedRows === 1) {
            return response.status(201).json({
                message: "The billing has been successfully Updated."
            });
        }
    }
    catch(err)
    {
        next(err);
    }
    }
  
    exports.deletebilling = async (request, response) => {
        const [row] = await conn.execute('Delete from billing_information where id = ?',[request.body.id]);
      
        if (row.affectedRows === 1) {
            return response.status(201).json({
                message: "The billing information has deleted."
            });
        }
    }