const express = require('express');
const employerController = require('./../controller/employerController');

const router = express.Router();

// Post Path here is only used by admin to create a new Employer
router
  .route('/')
  .get(employerController.getAllEmployers)
  .post(employerController.createEmployer);

router
  .route('/:id')
  .get(employerController.getOneEmployer)
  .patch(employerController.updateEmployer)
  .delete(employerController.removeEmployer);

module.exports = router;
