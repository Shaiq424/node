const { response } = require('express');
const { validationResult } = require('express-validator');
const conn = require('../dbConnection').promise();

//Posting Resume
exports.resumePosting = async(req, res, next) => {

        var date = new Date();

        try {
            const [id] = await conn.execute('Select id from resume where user_id = ?', [req.body.user_id]);

            if (id.length > 0) {
                const ide = id[0].id;
                await conn.execute('Delete from resume where id = ?', [ide]);
                await conn.execute('Delete from resume_award where resume_id = ?', [ide]);
                await conn.execute('Delete from resume_certification where resume_id = ?', [ide]);
                await conn.execute('Delete from resume_education where resume_id = ?', [ide]);
                await conn.execute('Delete from resume_experience where resume_id = ?', [ide]);
                await conn.execute('Delete from resume_language where resume_id = ?', [ide]);
                await conn.execute('Delete from resume_military_info where resume_id = ?', [ide]);
                await conn.execute('Delete from resume_reference where resume_id = ?', [ide]);
                await conn.execute('Delete from resume_volunteer_work where resume_id = ?', [ide]);
            }

            const [rows] = await conn.execute('INSERT INTO `resume` (`user_id`,`first_name`, `middle_name`, `last_name`, `city`, `state`, `zipcode`, `email`, `contact_number`, `add_contact_number`, `employment_eligibility`, `professional_summary`) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [

                req.body.user_id,
                req.body.first_name,
                req.body.middle_name,
                req.body.last_name,
                req.body.city,
                req.body.state,
                req.body.zipcode,
                req.body.email,
                req.body.contact_number,
                req.body.add_contact_number,
                req.body.employment_eligibility,
                req.body.professional_summary,
            ]);

            const ids = await conn.query('Select `id` from resume ORDER BY ID DESC LIMIT 1');
            const getId = ids[0, [0]];
            const getid = getId[0].id;
            if (req.body.award) {
                req.body.award.forEach(async function(element, index) {
                    const title = element.title;
                    const date = element.date;
                    await conn.execute('INSERT INTO `resume_award`(`resume_id`, `title`, `date`) VALUES (?,?,?)', [getid, title, date])
                });
            }

            if (req.body.certification) {
                req.body.certification.forEach(async function(element, index) {
                    const title = element.title;
                    const date = element.date;
                    await conn.execute('INSERT INTO `resume_certification`(`resume_id`, `title`, `date`) VALUES (?,?,?)', [getid, title, date])
                });
            }

            if (req.body.education) {
                req.body.education.forEach(async function(element, index) {
                    const level_of_education = element.level_of_education;
                    const school = element.school;
                    const degree = element.degree;
                    const major = element.major;
                    const city = element.city;
                    const date_of_completion = element.date_of_completion;
                    await conn.execute('INSERT INTO `resume_education`(`resume_id`, `level_of_education`, `school`, `degree`, `major`, `city`, `date_of_completion`) VALUES (?,?,?,?,?,?,?)', [getid, level_of_education, school, degree, major, city, date_of_completion])
                });
            }

            if (req.body.experience) {
                req.body.experience.forEach(async function(element, index) {
                    const job_title = element.job_title;
                    const company = element.company;
                    const city = element.city;
                    const state = element.state;
                    const time_period_start = element.time_period_start;
                    const time_period_end = element.time_period_end;
                    const duties = element.duties;
                    await conn.execute('INSERT INTO `resume_experience`(`resume_id`, `job_title`, `company`, `city`, `state`, `time_period_start`, `time_period_end`, `duties`) VALUES (?,?,?,?,?,?,?,?)', [getid, job_title, company, city, state, time_period_start, time_period_end, duties])
                });
            }

            if (req.body.language) {
                req.body.language.forEach(async function(element, index) {
                    const lang = element.lang;
                    const level = element.level;
                    await conn.execute('INSERT INTO `resume_language`(`resume_id`, `lang`, `level`) VALUES (?,?,?)', [getid, lang, level])
                });
            }

            if (req.body.volunteer) {
                req.body.volunteer.forEach(async function(element, index) {
                    const title = element.title;
                    const start = element.start;
                    const end = element.end;
                    await conn.execute('INSERT INTO `resume_volunteer_work`(`resume_id`, `title`, `start`,`end`) VALUES (?,?,?,?)', [getid, title, start, end])
                });
            }

            if (req.body.reference) {
                req.body.reference.forEach(async function(element, index) {
                    const name = element.name;
                    const contact_number = element.contact_number;
                    const relationship = element.relationship;
                    const email = element.email;
                    await conn.execute('INSERT INTO `resume_reference`(`resume_id`, `name`, `contact_number`,`relationship`,`email`) VALUES (?,?,?,?,?)', [getid, name, contact_number, relationship, email])
                });
            }

            if (req.body.military) {
                req.body.military.forEach(async function(element, index) {
                    const military_service = element.military_service;
                    const country = element.country;
                    const rank = element.rank;
                    const start_date = element.start_date;
                    const end_date = element.end_date;
                    const security_clearance = element.security_clearance;
                    await conn.execute('INSERT INTO `resume_military_info`(`resume_id`, `military_service`, `country`, `rank`, `start_date`, `end_date`, `security_clearance`) VALUES (?,?,?,?,?,?,?)', [getid, military_service, country, rank, start_date, end_date, security_clearance])
                });
            }

            const idss = await conn.query('Select `id` from resume_military_info ORDER BY ID DESC LIMIT 1');
            const getIds = idss[0, [0]];
            const getids = getIds[0].id;

            if (req.body.military_branch) {
                req.body.military_branch.forEach(async function(element, index) {
                    const branch = element.branch;
                    await conn.execute('INSERT INTO `resume_military_branch`(`military_id`,`resume_id`, `branch`) VALUES (?,?,?)', [getids, getid, branch])
                });
            }

            if (req.body.military_mos) {
                req.body.military_mos.forEach(async function(element, index) {
                    const mos = element.mos;
                    await conn.execute('INSERT INTO `resume_military_mos`(`military_id`, `resume_id`,`mos`) VALUES (?,?,?)', [getids, getid, mos])
                });
            }


            if (rows.affectedRows === 1) {
                await conn.execute('Update `users` SET is_resume = 1 where id = ?', [req.body.user_id])

                return res.status(201).json({
                    message: "The Resume has been successfully inserted."
                });
            }
        } catch (err) {
            next(err);
        }

    }
    // Posting Resume End


    exports.getResume = async(request, response) => {
        const [row] = await conn.execute('Select *,(select GROUP_CONCAT(job_title) from resume_experience where resume_id = resume.id) as Job_title,(select GROUP_CONCAT(company) from resume_experience where resume_id = resume.id) as company from resume');
        if (row.length > 0) {
            return response.json({
                job: row,
            });
        }
        response.json({
            message: "No Resume found"
        });
    }

    exports.getResumebyMainId = async(request, response) => {
        const [row] = await conn.execute('Select * from resume where id = ?', [request.params.id]);
        const [award] = await conn.execute('Select * from resume_award where resume_id = ?', [row[0]['id']]);
        const [education] = await conn.execute('Select * from resume_education where resume_id = ?', [row[0]['id']]);
        const [experience] = await conn.execute('Select * from resume_experience where resume_id = ?', [row[0]['id']]);
        const [certification] = await conn.execute('Select * from resume_certification where resume_id = ?', [row[0]['id']]);
        const [language] = await conn.execute('Select * from resume_language where resume_id = ?', [row[0]['id']]);
        const [military] = await conn.execute('Select * from resume_military_info where resume_id = ?', [row[0]['id']]);
        const [mos] = await conn.execute('Select * from resume_military_mos where resume_id = ?', [row[0]['id']]);
        const [branch] = await conn.execute('Select * from resume_military_branch where resume_id = ?', [row[0]['id']]);
        const [reference] = await conn.execute('Select * from resume_reference where resume_id = ?', [row[0]['id']]);
        const [volunteer] = await conn.execute('Select * from resume_volunteer_work where resume_id = ?', [row[0]['id']]);
        if (row.length > 0) {
            return response.json({
                job: row,
                award: award,
                education: education,
                experience: experience,
                certification: certification,
                language: language,
                military: military,
                mos: mos,
                branch: branch,
                reference: reference,
                volunteer: volunteer
            });
        }
        response.json({
            message: "No Job found"
        });
    }

exports.getResumebyId = async(request, response) => {
    const [row] = await conn.execute('Select * from resume where user_id = ?', [request.params.id]);
    const [award] = await conn.execute('Select * from resume_award where resume_id = ?', [row[0]['id']]);
    const [education] = await conn.execute('Select * from resume_education where resume_id = ?', [row[0]['id']]);
    const [experience] = await conn.execute('Select * from resume_experience where resume_id = ?', [row[0]['id']]);
    const [certification] = await conn.execute('Select * from resume_certification where resume_id = ?', [row[0]['id']]);
    const [language] = await conn.execute('Select * from resume_language where resume_id = ?', [row[0]['id']]);
    const [military] = await conn.execute('Select * from resume_military_info where resume_id = ?', [row[0]['id']]);
    const [mos] = await conn.execute('Select * from resume_military_mos where resume_id = ?', [row[0]['id']]);
    const [branch] = await conn.execute('Select * from resume_military_branch where resume_id = ?', [row[0]['id']]);
    const [reference] = await conn.execute('Select * from resume_reference where resume_id = ?', [row[0]['id']]);
    const [volunteer] = await conn.execute('Select * from resume_volunteer_work where resume_id = ?', [row[0]['id']]);

    if (row.length > 0) {
        return response.json({
            job: row,
            award: award,
            education: education,
            experience: experience,
            certification: certification,
            language: language,
            military: military,
            mos: mos,
            branch: branch,
            reference: reference,
            volunteer: volunteer
        });
    }

    response.json({
        message: "No Job found"
    });
}

exports.updateResume = async(req, res, next) => {
    var date = new Date();

    try {
        const [rows] = await conn.execute('INSERT INTO `resume` (`user_id`,`first_name`, `middle_name`, `last_name`, `city`, `state`, `zipcode`, `email`, `contact_number`, `add_contact_number`, `employment_eligibility`, `professional_summary`) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [

            req.body.user_id,
            req.body.first_name,
            req.body.middle_name,
            req.body.last_name,
            req.body.city,
            req.body.state,
            req.body.zipcode,
            req.body.email,
            req.body.contact_number,
            req.body.add_contact_number,
            req.body.employment_eligibility,
            req.body.professional_summary,
        ]);

        const ids = await conn.query('Select `id` from resume ORDER BY ID DESC LIMIT 1');
        const getId = ids[0, [0]];
        const getid = getId[0].id;
        if (req.body.award) {
            req.body.award.forEach(async function(element, index) {
                const title = element.title;
                const date = element.date;
                await conn.execute('INSERT INTO `resume_award`(`resume_id`, `title`, `date`) VALUES (?,?,?)', [getid, title, date])
            });
        }

        if (req.body.certification) {
            req.body.certification.forEach(async function(element, index) {
                const title = element.title;
                const date = element.date;
                await conn.execute('INSERT INTO `resume_certification`(`resume_id`, `title`, `date`) VALUES (?,?,?)', [getid, title, date])
            });
        }

        if (req.body.education) {
            req.body.education.forEach(async function(element, index) {
                const level_of_education = element.level_of_education;
                const school = element.school;
                const degree = element.degree;
                const major = element.major;
                const city = element.city;
                const date_of_completion = element.date_of_completion;
                await conn.execute('INSERT INTO `resume_education`(`resume_id`, `level_of_education`, `school`, `degree`, `major`, `city`, `date_of_completion`) VALUES (?,?,?,?,?,?,?)', [getid, level_of_education, school, degree, major, city, date_of_completion])
            });
        }

        if (req.body.experience) {
            req.body.experience.forEach(async function(element, index) {
                const job_title = element.job_title;
                const company = element.company;
                const city = element.city;
                const state = element.state;
                const time_period_start = element.time_period_start;
                const time_period_end = element.time_period_end;
                const duties = element.duties;
                await conn.execute('INSERT INTO `resume_experience`(`resume_id`, `job_title`, `company`, `city`, `state`, `time_period_start`, `time_period_end`, `duties`) VALUES (?,?,?,?,?,?,?,?)', [getid, job_title, company, city, state, time_period_start, time_period_end, duties])
            });
        }

        if (req.body.language) {
            req.body.language.forEach(async function(element, index) {
                const lang = element.lang;
                const level = element.level;
                await conn.execute('INSERT INTO `resume_language`(`resume_id`, `language`, `level`) VALUES (?,?,?)', [getid, lang, level])
            });
        }

        if (req.body.volunteer) {
            req.body.volunteer.forEach(async function(element, index) {
                const title = element.title;
                const start = element.start;
                const end = element.end;
                await conn.execute('INSERT INTO `resume_volunteer_work`(`resume_id`, `title`, `start`,`end`) VALUES (?,?,?,?)', [getid, title, start, end])
            });
        }

        if (req.body.reference) {
            req.body.reference.forEach(async function(element, index) {
                const name = element.name;
                const contact_number = element.contact_number;
                const relationship = element.relationship;
                const email = element.email;
                await conn.execute('INSERT INTO `resume_reference`(`resume_id`, `name`, `contact_number`,`relationship`,`email`) VALUES (?,?,?,?,?)', [getid, name, contact_number, relationship, email])
            });
        }

        if (req.body.military) {
            req.body.military.forEach(async function(element, index) {
                const military_service = element.military_service;
                const country = element.country;
                const rank = element.rank;
                const start_date = element.start_date;
                const end_date = element.end_date;
                const security_clearance = element.security_clearance;
                await conn.execute('INSERT INTO `resume_military_info`(`resume_id`, `military_service`, `country`, `rank`, `start_date`, `end_date`, `security_clearance`) VALUES (?,?,?,?,?,?,?)', [getid, military_service, country, rank, start_date, end_date, security_clearance])
            });
        }

        const idss = await conn.query('Select `id` from resume_military_info ORDER BY ID DESC LIMIT 1');
        const getIds = idss[0, [0]];
        const getids = getIds[0].id;

        if (req.body.military_branch) {
            req.body.military_branch.forEach(async function(element, index) {
                const branch = element.branch;
                await conn.execute('INSERT INTO `resume_military_branch`(`military_id`,`resume_id`, `branch`) VALUES (?,?,?)', [getids, getid, branch])
            });
        }

        if (req.body.military_mos) {
            req.body.military_mos.forEach(async function(element, index) {
                const mos = element.mos;
                await conn.execute('INSERT INTO `resume_military_mos`(`military_id`,`resume_id`, `mos`) VALUES (?,?,?)', [getids, getid, mos])
            });
        }
        await conn.execute('Delete from resume where id = ?', [req.body.id]);
        await conn.execute('Delete from resume_award where resume_id = ?', [req.body.id]);
        await conn.execute('Delete from resume_certification where resume_id = ?', [req.body.id]);
        await conn.execute('Delete from resume_education where resume_id = ?', [req.body.id]);
        await conn.execute('Delete from resume_experience where resume_id = ?', [req.body.id]);
        await conn.execute('Delete from resume_language where resume_id = ?', [req.body.id]);
        await conn.execute('Delete from resume_military_info where resume_id = ?', [req.body.id]);
        await conn.execute('Delete from resume_reference where resume_id = ?', [req.body.id]);
        await conn.execute('Delete from resume_volunteer_work where resume_id = ?', [req.body.id]);

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "The Resume has been successfully inserted."
            });
        }

    } catch (err) {
        next(err);
    }
}

exports.deleteResume = async(request, response) => {
    const [row] = await conn.execute('Delete from resume where id = ?', [request.body.id]);
    await conn.execute('Delete from resume_award where resume_id = ?', [request.body.id]);
    await conn.execute('Delete from resume_certification where resume_id = ?', [request.body.id]);
    await conn.execute('Delete from resume_education where resume_id = ?', [request.body.id]);
    await conn.execute('Delete from resume_experience where resume_id = ?', [request.body.id]);
    await conn.execute('Delete from resume_language where resume_id = ?', [request.body.id]);
    await conn.execute('Delete from resume_military_info where resume_id = ?', [request.body.id]);
    await conn.execute('Delete from resume_reference where resume_id = ?', [request.body.id]);
    await conn.execute('Delete from resume_volunteer_work where resume_id = ?', [request.body.id]);

    if (row.affectedRows === 1) {
        return response.status(201).json({
            message: "The Resume has been successfully Deleted."
        });
    } else {
        return response.status(401).json({
            message: "Resume Not Found"
        });
    }
}

exports.getInstitude = async(request, response) => {
    const [row] = await conn.execute('SELECT label,value FROM institute ;');

    if (row.length > 0) {
        return response.json({
            institude: row
        });
    }

    response.json({
        message: "No Institude found"
    });
}

exports.updateResumeStatus = async (request, response,next) => {
    try {
        const [rows] = await conn.execute('UPDATE `resume` SET `status`=? WHERE id = ?;',
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