const router = require('express').Router();
const { body } = require('express-validator');
const { register } = require('./controllers/registerController');
const {registered} =require('./controllers/employeeRegister')
const { login } = require('./controllers/loginController');
const { getUser } = require('./controllers/getUserController');
const { jobPosting, getJobs, getJobsbyId, getJobsbyUserId, updateJob, deleteJob ,updateStatus,refreshJob} = require('./controllers/jobPostingController');
const { resumePosting, getResume, getResumebyId, deleteResume, getInstitude, updateResume,updateResumeStatus,getResumebyMainId } = require('./controllers/resumeController');
const { reportJob } = require('./controllers/reportjobController');
const { getJobSearch } = require('./controllers/jobSearchingController');
const { getapplicationHistory } = require('./controllers/applicationHistoryController');
const { billingPosting, getbilling, getbillingsbyId, updatebilling, deletebilling } = require('./controllers/billinginformation');
const { jobApplying, getJobApplied, updateJobApplied, updateAppliedStatus } = require('./controllers/applyController');
const { templatePosting , getTemplate } = require('./controllers/messagetemplateController');
const { savedresume, getsaveresume, deletesaveresume } = require('./controllers/savedresumeController');
const { updateUserPassword, updateUser } = require('./controllers/userUpdateController');
const { aboutPosting ,getabout } = require('./controllers/aboutController');
const {contactus,getcontact} = require('./controllers/contactcontroller');
const { termsPosting ,getterms } = require('./controllers/termsController');
const { privacyPosting ,getprivacy } = require('./controllers/privacyController');
const {getEmail,forgotPassword}=require('./controllers/forgotpasswordController')
const cors = require("cors")
router.use(cors())
    //Auth Route
router.post('/register', [
    body('first_name', "The name must be of minimum 3 characters length")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 3 }),
    body('email', "Invalid email address")
    .notEmpty()
    .escape()
    .trim().isEmail(),
], register);


router.post('/login', [
    body('email', "Invalid email address")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password', "The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),
], login);

router.get('/getuser', getUser);

router.post('/getemail', getEmail);

router.post('/registered', registered);

router.post('/forgotpassword', forgotPassword);
//Auth Route

//Job Posting Route
router.post('/jobs/insert', jobPosting);

router.get('/jobs/get', getJobs);

router.get('/jobs/getbyid/:id', getJobsbyId);

router.get('/jobs/getbyuserid/:id', getJobsbyUserId);

router.post('/jobs/update', updateJob);
router.post('/jobs/update/status',updateStatus);
router.post('/jobs/refresh',refreshJob);

router.post('/jobs/delete', deleteJob);
//Job Posting Route End

//Resume Route
router.post('/resume/insert', resumePosting);

router.get('/resume/get', getResume);

router.post('/resume/update/status',updateResumeStatus);

router.get('/resume/getbyid/:id', getResumebyId);

router.get('/resume/getbymainid/:id', getResumebyMainId);

router.post('/resume/delete', deleteResume);

router.post('/resume/update', updateResume);

router.get('/institude/get', getInstitude);
//Resume Route End

//Report Job Route
router.post('/report/job', reportJob);
//Report Job Route Ends

//Search Job Route
router.post('/job/search', getJobSearch);
//Search Job Route Ends

//Get Application History
router.get('/application/history/:id', getapplicationHistory);
//Get Application History End

//billing Posting Route
router.post('/billings/insert', billingPosting);

router.get('/billings/get', getbilling);

router.get('/billings/getbyid/:id', getbillingsbyId);

router.post('/billings/update', updatebilling);

router.post('/billings/delete', deletebilling);
//Job Posting Route End

//job apply Posting Route
router.post('/jobs/apply/insert', jobApplying);

router.get('/jobs/apply/get', getJobApplied);

router.post('/jobs/apply/update', updateJobApplied);

router.post('/jobs/applystatus/update', updateAppliedStatus);

//Job apply Posting Route End

router.post('/template/insert', templatePosting);

router.get('/template/get/:id', getTemplate);

router.post('/resume/save', savedresume);

router.get('/resume/save/get/:id', getsaveresume);

router.post('/resume/save/delete', deletesaveresume);

router.post('/user/update', updateUser);

router.post('/user/password/update', updateUserPassword);

router.post('/about/insert', aboutPosting);

router.get('/about/get', getabout);

router.post('/contact/insert',contactus);

router.get('/contact/get',getcontact);

router.post('/terms/insert',termsPosting);

router.get('/terms/get',getterms);

router.post('/privacy/insert',privacyPosting);

router.get('/privacy/get',getprivacy);

module.exports = router;