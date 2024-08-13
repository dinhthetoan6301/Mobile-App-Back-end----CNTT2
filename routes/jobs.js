const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect } = require('../middleware/authMiddleware');

// Helper function to get applicant count
const getApplicantCount = async (jobId) => {
  return await Application.countDocuments({ job: jobId });
};

// Get all jobs with search, filter, and option to get posted jobs
router.get('/', protect, async (req, res) => {
  try {
    const { search, industry, type, minSalary, maxSalary, posted } = req.query;
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

    if (posted === 'true') {
      query.postedBy = req.user._id;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    // Add applicant count to each job
    const jobsWithApplicantCount = await Promise.all(jobs.map(async (job) => {
      const applicantCount = await getApplicantCount(job._id);
      return { ...job.toObject(), applicantCount };
    }));

    res.json(jobsWithApplicantCount);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent jobs
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 2;
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(limit);

    // Add applicant count to each recent job
    const recentJobsWithApplicantCount = await Promise.all(recentJobs.map(async (job) => {
      const applicantCount = await getApplicantCount(job._id);
      return { ...job.toObject(), applicantCount };
    }));

    res.json(recentJobsWithApplicantCount);
  } catch (error) {
    console.error('Error fetching recent jobs:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const applicantCount = await getApplicantCount(job._id);
    res.json({ ...job.toObject(), applicantCount });
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a job
router.put('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }
    
    // Đảm bảo numberOfPositions là số nguyên khi cập nhật
    if (req.body.numberOfPositions) {
      req.body.numberOfPositions = parseInt(req.body.numberOfPositions) || job.numberOfPositions;
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a job
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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

router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      benefits,
      salary,
      location,
      type,
      industry,
      applicationDeadline,
      numberOfPositions 
    } = req.body;

    const newJob = new Job({
      title,
      company,
      description,
      requirements,
      benefits,
      salary,
      location,
      type,
      industry,
      postedBy: req.user._id,
      applicationDeadline,
      numberOfPositions: parseInt(numberOfPositions) || 1, // Đảm bảo là số nguyên, mặc định là 1
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;