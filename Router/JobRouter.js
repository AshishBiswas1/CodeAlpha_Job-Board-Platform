const express = require('express');
const JobController = require('./../controller/jobController');
const authController = require('./../controller/authController');
const Candidate = require('./../Model/CandidateModel');
const applicationController = require('./../controller/applicationController');
const Employer = require('./../Model/EmployerModel');

const router = express.Router();

router.route(
  '/getYourPostedJobs',
  authController.protect(Employer),
  authController.restrictTo('employer'),
  JobController.getJobsByEmployer
);

router
  .route('/:jobId/apply')
  .post(authController.protect(Candidate), applicationController.applyForJob);

router.route('/').get(JobController.getAllJobs).post(JobController.createJob);

router
  .route('/:id')
  .get(JobController.getJob)
  .patch(JobController.updateJobPofile)
  .delete(JobController.removeJobProfile);

module.exports = router;
