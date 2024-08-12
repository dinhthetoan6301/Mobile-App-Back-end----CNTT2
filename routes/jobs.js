const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect } = require('../middleware/authMiddleware');

// Get all jobs with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, industry, type, minSalary, maxSalary } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (industry) query.industry = industry;
    if (type) query.type = type;
    if (minSalary) query['salary.min'] = { $gte: parseInt(minSalary) };
    if (maxSalary) query['salary.max'] = { $lte: parseInt(maxSalary) };
    
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Post a new job
router.post('/', protect, async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      postedBy: req.user._id
    });
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get jobs posted by the current user
router.get('/posted', protect, async (req, res) => {
  try {
    console.log('User:', req.user); // Log user info for debugging
    const postedJobs = await Job.find({ postedBy: req.user._id });
    res.json(postedJobs);
  } catch (error) {
    console.error('Error fetching posted jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Get recent jobs
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 2;
    console.log('Fetching recent jobs with limit:', limit);

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    console.log('Recent jobs found:', recentJobs.length);
    res.json(recentJobs);
  } catch (error) {
    console.error('Error fetching recent jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// Get candidates for a specific job
router.get('/:id/candidates', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view candidates for this job' });
    }
    const applications = await Application.find({ job: req.params.id }).populate('applicant');
    res.json(applications);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Error fetching candidates', error: error.message });
  }
});




module.exports = router;