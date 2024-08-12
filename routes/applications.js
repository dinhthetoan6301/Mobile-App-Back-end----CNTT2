const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

// Apply for a job
router.post('/', protect, async (req, res) => {
  try {
    const { jobId } = req.body;
    const newApplication = new Application({
      applicant: req.user._id,
      job: jobId
    });
    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error: error.message });
  }
});

// Get application status for a user
router.get('/status', protect, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Update application status (for employers)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    // Here you might want to add a check to ensure the user is the employer who posted the job
    application.status = status;
    await application.save();
    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
});

module.exports = router;