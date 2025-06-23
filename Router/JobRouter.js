const express = require('express');
const JobController = require('./../controller/jobController');

const router = express.Router();

router.route('/').get(JobController.getAllJobs).post(JobController.createJob);

router
  .route('/:id')
  .get(JobController.getJob)
  .patch(JobController.updateJobPofile)
  .delete(JobController.removeJobProfile);

module.exports = router;
