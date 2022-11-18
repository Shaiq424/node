const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();

exports.privacyPosting = async(req,res,next) => {

    var date = new Date();
    try
    {
        const [rows] = await conn.execute('INSERT INTO `privacy`(`privacy`) VALUES (?)',[
            req.body.privacy,
        ]);
        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "privacy saved successfully."
            });
        }
    }
    catch(err)
    {
        next(err);
    }
}


exports.getprivacy = async (request, response) => {
    const [row] = await conn.execute('SELECT * FROM `privacy`;');

    if(row.length > 0){
        return response.json({
            job:row
        });
    }

    response.json({
        message:"No privacy found"
    });
    }