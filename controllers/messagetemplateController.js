const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();

exports.templatePosting = async(req,res,next) => {
    var date = new Date();
    try
    {
        const user_count = await conn.execute('SELECT COUNT(user_id) as user_count FROM `message_template` where user_id = ?;',[req.body.user_id]);
        console.log(user_count[0][0].user_count);
        if(user_count[0][0].user_count <= 19)
        {
            const [rows] = await conn.execute('INSERT INTO `message_template`(`user_id`,`template_name`, `introduction`, `description`) VALUES (?,?,?,?)',[
                req.body.user_id,
                req.body.template_name,
                req.body.introduction,
                req.body.description,
            ]);

            if (rows.affectedRows === 1) {
                return res.status(201).json({
                    message: "The Message template is Saved."
                });
            }
        }
        else
        {
            return res.status(201).json({
                message: "Limit Over"
            });
        }
    }
    catch(err)
    {
        next(err);
    }
}

exports.getTemplate = async (request, response) => {
    const [row] = await conn.execute('SELECT * FROM `message_template` where user_id = ?;',[request.params.id]);

    if(row.length > 0){
        return response.json({
            job:row
        });
    }

    response.json({
        message:"No privacy found"
    });
    }
