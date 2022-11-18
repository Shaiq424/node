const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();

exports.getJobSearch = async (req, response) => {
      
    if(req.body.mindate && req.body.maxdate)
    {
        sql = 'SELECT * FROM `job`where ((`job_title` LIKE "%'+[req.body.jobtitle]+'%" OR `company_name` LIKE "%'+[req.body.jobtitle]+'%") AND `location` LIKE "%'+[req.body.location]+'%" AND `created_at` BETWEEN "'+[req.body.mindate]+'" AND "'+[req.body.maxdate]+'")';
    }
    else
    {
        sql = 'SELECT * FROM `job`where ((`job_title` LIKE "%'+[req.body.jobtitle]+'%" OR `company_name` LIKE "%'+[req.body.jobtitle]+'%") AND `location` LIKE "%'+[req.body.location]+'%")';
    }

    const [row] = await conn.execute(sql);

    if(row.length > 0){
        return response.json({
            job:row
        });
    }

    response.json({
        message:"No Job found"
    });
    }