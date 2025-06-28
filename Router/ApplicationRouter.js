const express = require('express');
const applicationController = require('./../controller/applicationController');

const router = express.Router({ mergeParams: true });

router.get('/:id/status', applicationController.updateAppliccationStatus);

router
  .route('/')
  .get(applicationController.getAllApplications)
  .post(applicationController.apply);

router
  .route('/:id')
  .get(applicationController.getApplication)
  .patch(applicationController.updateApplication)
  .delete(applicationController.removeApplication);

module.exports = router;
