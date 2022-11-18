const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();

exports.savedresume = async(req,res,next) => {

    var date = new Date();
    try
    {
        const [count] = await conn.execute('Select count(id) as count from save_resume where user_id = ?',[req.body.user_id]);
        console.log(count[0].count);
        if(count[0].count <= 20)
        {
        const [rows] = await conn.execute('INSERT INTO `save_resume`(`user_id`, `resume_id`,`saved_at`) VALUES (?,?,?)',[
            req.body.user_id,
            req.body.resume_id,
            date
        ]);
        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "Resume Saved Successfully."
            });
        }
        
    }
    response.json({
        message:"Limit over"
    });
    }
    catch(err)
    {
        next(err);
    }
}

exports.getsaveresume = async (request, response) => {
    const [row] = await conn.execute('SELECT *,(SELECT first_name FROM resume where id = save_resume.resume_id) as First_name FROM `save_resume` where user_id = ?;',[request.params.id]);
    if(row.length > 0){
        return response.json({
            date_saved:row
        });
    }
    response.json({
        message:"No Saved Resume found"
    });
}

    exports.deletesaveresume = async (request, response) => {
        const [row] = await conn.execute('Delete from save_resume where id = ?',[request.body.id]);
      
        if (row.affectedRows === 1) {
            return response.status(201).json({
                message: "Save Resume has been successfully Deleted."
            });
        }
    }