const express = require('express');
const router = express.Router();
const { getJobs, createJob, getJobById, getRecentJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, createJob);
router.get('/recent', getRecentJobs);
router.get('/:id', getJobById);

module.exports = router;