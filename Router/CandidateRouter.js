const express = require('express');
const Candidate = require('./../Model/CandidateModel');
const candidateController = require('./../controller/candidateController');
const authController = require('./../controller/authController');

const router = express.Router();
// Login and signup
router.route('/signup').post(authController.CandidateSignup);
router.route('/login').post(authController.CandidateLogin);
router.route('/forgetPassword').post(authController.forgotPassword(Candidate));
router
  .route('/resetPassword/:token')
  .patch(authController.resetPassword(Candidate));

router
  .route('/updatepassword')
  .patch(
    authController.protect(Candidate),
    authController.restrictTo('candidate'),
    authController.updatePassword(Candidate)
  );

router
  .route('/updateMe')
  .patch(
    authController.protect(Candidate),
    authController.restrictTo('candidate'),
    candidateController.uploadCandidateFiles,
    candidateController.resizeCandidatePhoto,
    candidateController.saveCandidateResume,
    candidateController.updateMe
  );

router
  .route('/deleteMe')
  .patch(
    authController.protect(Candidate),
    authController.restrictTo('candidate'),
    candidateController.deleteMe
  );

router
  .route('/Me')
  .get(
    authController.protect(Candidate),
    authController.restrictTo('candidate'),
    candidateController.getMe
  );

router.use(
  authController.protect(Candidate),
  authController.restrictTo('admin')
);
// All these paths are only used by admin
router.route('/').get(candidateController.getAllCandidate);

router
  .route('/:id')
  .get(candidateController.getCandidate)
  .patch(candidateController.updateCandidate)
  .delete(candidateController.removeCandidate);

module.exports = router;
