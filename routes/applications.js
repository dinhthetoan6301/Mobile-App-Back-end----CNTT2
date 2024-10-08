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
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company')  // Populate chỉ lấy title và company của job
      .sort({ appliedDate: -1 });  // Sắp xếp theo ngày apply, mới nhất lên đầu
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching application status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/applied', protect, async (req, res) => {
  try {
    console.log('Fetching applied jobs for user:', req.user._id);

    const appliedJobs = await Application.find({ applicant: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    console.log('Applied jobs found:', appliedJobs.length);
    res.json(appliedJobs);
  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
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