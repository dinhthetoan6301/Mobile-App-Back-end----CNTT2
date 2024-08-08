const express = require('express');
const router = express.Router();
const { 
  createApplication, 
  getApplications, 
  getApplicationStatus, 
  updateApplicationStatus,
  addFeedback,
  getFeedback
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createApplication).get(protect, getApplications);
router.route('/:id/status')
  .get(protect, getApplicationStatus)
  .put(protect, updateApplicationStatus);
router.route('/:id/feedback')
  .post(protect, addFeedback)
  .get(protect, getFeedback);

module.exports = router;