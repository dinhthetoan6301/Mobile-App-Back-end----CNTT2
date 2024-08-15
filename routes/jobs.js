const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect } = require('../middleware/authMiddleware');


const getApplicantCount = async (jobId) => {
  return await Application.countDocuments({ job: jobId });
};


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

router.put('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      console.log(`Job not found with id: ${req.params.id}`);
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.postedBy.toString() !== req.user._id.toString()) {
      console.log(`User ${req.user._id} not authorized to update job ${job._id}`);
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }
    
    console.log('Updating job:', req.params.id);
    console.log('Update data:', req.body);


    const updatableFields = [
      'title', 'company', 'description', 'requirements', 'benefits', 
      'salary', 'location', 'type', 'industry', 'applicationDeadline', 'numberOfPositions'
    ];

 
    const updateData = {};
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });


    if (updateData.numberOfPositions) {
      updateData.numberOfPositions = parseInt(updateData.numberOfPositions) || job.numberOfPositions;
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
    console.log('Job updated successfully:', updatedJob);
    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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

// Create a new job
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
      numberOfPositions: parseInt(numberOfPositions) || 1,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;