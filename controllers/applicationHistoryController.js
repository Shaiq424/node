const { response } = require('express');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();

exports.getapplicationHistory = async (request, response) => {
    const [row] = await conn.execute('Select * from apply_job where candidate_id = ?',[request.params.id]);

    if(row.length > 0){
        return response.json({
            job:row
        });
    }

    response.json({
        message:"No Resume found"
    });
}