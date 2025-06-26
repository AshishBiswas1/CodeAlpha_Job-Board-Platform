const express = require('express');
const Employer = require('./../Model/EmployerModel');
const employerController = require('./../controller/employerController');
const authController = require('./../controller/authController');

const router = express.Router();

router.route('/signup').post(authController.Employersignup);
router.route('/login').post(authController.Employerlogin);
router.route('/forgetPassword').post(authController.forgotPassword(Employer));
router
  .route('/resetPassword/:token')
  .patch(authController.resetPassword(Employer));

router
  .route('/updatePassword')
  .patch(
    authController.protect(Employer),
    authController.restrictTo('employer'),
    authController.updatePassword(Employer)
  );

router
  .route('/updateMe')
  .patch(
    authController.protect(Employer),
    authController.restrictTo('employer'),
    employerController.uploadEmployerPhoto,
    employerController.resizeEmployerPhoto,
    employerController.updateMe
  );
router
  .route('/deleteMe')
  .patch(
    authController.protect(Employer),
    authController.restrictTo('employer'),
    employerController.deleteMe
  );

router
  .route('/Me')
  .get(
    authController.protect(Employer),
    authController.restrictTo('employer'),
    employerController.getMe
  );

// Post Path here is only used by admin to create a new Employer
router.use(
  authController.protect(Employer),
  authController.restrictTo('admin')
);
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
