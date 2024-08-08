const express = require('express');
const router = express.Router();
const { getJobs, createJob, getJobById } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.post('/', protect, createJob);
router.get('/:id', getJobById);

module.exports = router;