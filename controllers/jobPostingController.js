const { response } = require('express');
const { validationResult } = require('express-validator');
const conn = require('../dbConnection').promise();

exports.jobPosting = async(req, res, next) => {

    var date = new Date();
    try {
        const [rows] = await conn.execute('INSERT INTO `job`(`user_id`,`first_name`, `last_name`, `company_name`, `company_size`, `phone_number`, `hear_about_us`, `job_title`, `location`, `city`, `state`, `zip_code`, `employment`, `experience_level`, `education`, `pay_rate_minimum`, `pay_rate_maximum`, `pay_rate_type`, `other_compensations`,`display_amount`,`description`, `company_overview`, `travel`, `position_opened`, `email`,`created_at`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
            req.body.user_id,
            req.body.first_name,
            req.body.last_name,
            req.body.company_name,
            req.body.company_size,
            req.body.phone_number,
            req.body.hear_about_us,
            req.body.job_title,
            req.body.location,
            req.body.city,
            req.body.state,
            req.body.zip_code,
            req.body.employment,
            req.body.experience_level,
            req.body.education,
            req.body.pay_rate_minimum,
            req.body.pay_rate_maximum,
            req.body.pay_rate_type,
            req.body.other_compensations,
            req.body.display_amount,
            req.body.description,
            req.body.company_overview,
            req.body.travel,
            req.body.position_opened,
            req.body.email,
            date
        ]);
        const ids = await conn.query('Select `id` from job ORDER BY ID DESC LIMIT 1');
        const getId = ids[0, [0]];
        const getid = getId[0].id;
        if (req.body.benefits) {
            req.body.benefits.forEach(async function(element, index) {
                const name = element.benefit;
                await conn.execute('INSERT INTO `jobs_benefits`(`job_id`, `benefits`) VALUES (?,?)', [getid, name])
            });
        }
        if (req.body.responsibility) {
            req.body.responsibility.forEach(async function(element, index) {
                const name = element.responsibility;
                await conn.execute('INSERT INTO `job_responsibilities`(`job_id`, `responsibility`) VALUES (?,?)', [getid, name])
            });
        }

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "The Job has been successfully inserted."
            });
        }
    } catch (err) {
        next(err);
    }
}

exports.getJobs = async(request, response) => {
    const [row] = await conn.execute('SELECT * FROM `job`;');

    if (row.length > 0) {
        return response.json({
            job: row
        });
    }

    response.json({
        message: "No Job found"
    });
}

exports.getJobsbyId = async(request, response) => {
    const [row] = await conn.execute('Select * from job where id = ?', [request.params.id]);
    const getId = row[0, [0]];
    const getid = getId.id;
    // console.log("fff",getid)
    const [benefit] = await conn.execute('Select * from jobs_benefits where job_id = ?', [getid]);
    const [responsibility] = await conn.execute('Select * from job_responsibilities where job_id = ?', [getid]);

    if (row.length > 0) {
        return response.json({
            job: row,
            benefit: benefit,
            responsibility: responsibility
        });
    }

    response.json({
        message: "No Job found"
    });
}

exports.getJobsbyUserId = async(request, response) => {
    const [row] = await conn.execute('Select * FROM `job` where user_id = ?', [request.params.id]);

    if (row.length > 0) {
        return response.json({
            job: row
        });
    }

    response.json({
        message: "No Job found"
    });
}

exports.updateJob = async (request, response,next) => {
    try {
        const [rows] = await conn.execute('UPDATE `job` SET `first_name`=?,`last_name`=?,`company_name`=?,`company_size`=?,`phone_number`=?,`hear_about_us`=?,`job_title`=?,`location`=?,`city`=?,`state`=?,`zip_code`=?,`employment`=?,`experience_level`=?,`education`=?,`pay_rate_minimum`=?,`pay_rate_maximum`=?,`pay_rate_type`=?,`other_compensations`=?,`description`=?,`company_overview`=?,`travel`=?,`position_opened`=?,`email`=? WHERE id = ?;',
            [
                request.body.first_name,
                request.body.last_name,
                request.body.company_name,
                request.body.company_size,
                request.body.phone_number,
                request.body.hear_about_us,
                request.body.job_title,
                request.body.location,
                request.body.city,
                request.body.state,
                request.body.zip_code,
                request.body.employment,
                request.body.experience_level,
                request.body.education,
                request.body.pay_rate_minimum,
                request.body.pay_rate_maximum,
                request.body.pay_rate_type,
                request.body.other_compensations,
                request.body.description,
                request.body.company_overview,
                request.body.travel,
                request.body.position_opened,
                request.body.email,
                request.body.id
            ]);
        const ids = await conn.execute('Select * from `job` where id = ?',[request.body.id]);
        const getId = ids[0, [0]];
        const getid = getId[0].id;
        console.log(getid);
        await conn.execute('Delete from job_responsibilities where job_id = ?', [getid]);
        await conn.execute('Delete from jobs_benefits where job_id = ?', [getid]);
        if (request.body.benefits) {
            request.body.benefits.forEach(async function (element, index) {
                const name = element.benefit;
                await conn.execute('INSERT INTO `jobs_benefits`(`job_id`, `benefits`) VALUES (?,?)', [getid, name])
            });
        }
        if (request.body.responsibility) {
            request.body.responsibility.forEach(async function (element, index) {
                const name = element.responsibility;
                await conn.execute('INSERT INTO `job_responsibilities`(`job_id`, `responsibility`) VALUES (?,?)', [getid, name])
            });
        }
        if (rows.affectedRows === 1) {
            return response.status(201).json({
                message: "The Job has been successfully Updated."
            });
        }
    }
    catch (err) {
        next(err);
    }
}
exports.deleteJob = async (request, response) => {
    const [row] = await conn.execute('Delete from job where id = ?', [request.body.id]);
    const [rows] = await conn.execute('Delete from job_responsibilities where job_id = ?', [request.body.id]);
    const [rowss] = await conn.execute('Delete from jobs_benefits where job_id = ?', [request.body.id]);
    if (row.affectedRows === 1) {
        return response.status(201).json({
            message: "The Job has been successfully Deleted."
        });
    }
}
exports.updateStatus = async (request, response,next) => {
    try {
        const [rows] = await conn.execute('UPDATE `job` SET `status`=? WHERE id = ?;',
            [
                request.body.status,
                request.body.id
            ]);
        if(request.body.status === 1)
        {
            if (rows.affectedRows === 1) {
                return response.status(201).json({
                    message: "Pause Successfully."
                });
            }
        }
        else
        {
            if (rows.affectedRows === 1) {
                return response.status(201).json({
                    message: "Resume Successfully."
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
}
exports.refreshJob = async (request, response,next) => {
    try {
        var date = new Date();
        const [rows] = await conn.execute('UPDATE `job` SET `created_at`=? WHERE id = ?;',
            [
                date,
                request.body.id
            ]);
            if (rows.affectedRows === 1) {
                return response.status(201).json({
                    message: "Refreshed."
                });
            }
    }
    catch (err) {
        next(err);
    }
}