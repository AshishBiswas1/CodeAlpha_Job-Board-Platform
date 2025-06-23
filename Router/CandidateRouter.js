const express = require('express');
const candidateController = require('./../controller/candidateController');

const router = express.Router();

// All these paths are only used by admin
router.route('/').get(candidateController.getAllCandidate);

router
  .route('/:id')
  .get(candidateController.getCandidate)
  .patch(candidateController.updateCandidate)
  .delete(candidateController.removeCandidate);

module.exports = router;
