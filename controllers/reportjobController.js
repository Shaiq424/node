const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();

exports.reportJob = async(req,res,next) => {

    var date = new Date();
    try
    {
        const [rows] = await conn.execute('INSERT INTO `report_job`(`job_id`, `user_id`, `reason`, `details`, `created_at`) VALUES (?,?,?,?,?)',[
            req.body.job_id,
            req.body.user_id,
            req.body.reason,
            req.body.details,
            date
        ]);
        
        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "Job Reported Successfully"
            });
        }
    }
    catch(err)
    {
        next(err);
    }
}