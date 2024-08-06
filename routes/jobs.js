const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
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
    res.status(500).json({ message: 'Server error' });
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

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Received job ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid job ID');
      return res.status(400).json({ message: 'Invalid job ID' });
    }

    const job = await Job.findById(id);
    if (!job) {
      console.log('Job not found');
      return res.status(404).json({ message: 'Job not found' });
    }

    console.log('Job found:', job);
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;