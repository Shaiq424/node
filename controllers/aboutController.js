const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();

exports.aboutPosting = async(req,res,next) => {

    var date = new Date();
    try
    {
        const [rows] = await conn.execute('INSERT INTO `about`(`heading_1`, `description_1`, `heading_2`, `description_2`, `heading_3`, `description_3`, `image_1`, `image_2`) VALUES (?,?,?,?,?,?,?,?)',[
            req.body.heading_1,
            req.body.description_1,
            req.body.heading_2,
            req.body.description_2,
            req.body.heading_3,
            req.body.description_3,
            req.body.image_1,
            req.body.image_2,
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


exports.getabout = async (request, response) => {
    const [row] = await conn.execute('SELECT * FROM `about`;');

    if(row.length > 0){
        return response.json({
            job:row
        });
    }

    response.json({
        message:"No Billing found"
    });
    }