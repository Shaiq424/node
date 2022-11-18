const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();

exports.termsPosting = async(req,res,next) => {

    var date = new Date();
    try
    {
        const [rows] = await conn.execute('INSERT INTO `terms`(`terms`) VALUES (?)',[
            req.body.terms,
        ]);
        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "Terms saved successfully."
            });
        }
    }
    catch(err)
    {
        next(err);
    }
}


exports.getterms = async (request, response) => {
    const [row] = await conn.execute('SELECT * FROM `terms`;');

    if(row.length > 0){
        return response.json({
            job:row
        });
    }

    response.json({
        message:"No Terms found"
    });
    }