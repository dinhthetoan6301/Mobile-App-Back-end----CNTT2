const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/authMiddleware');

// Apply for a job
router.post('/', protect, async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's applications
router.get('/myapplications', protect, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;