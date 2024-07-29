const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const mongoose = require('mongoose');

// Apply for a job
router.post('/', async (req, res) => {
  try {
    const { job, user, coverLetter } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(job) || !mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ message: "Invalid job or user ID" });
    }

    // Check if job and user exist
    const jobExists = await Job.findById(job);
    const userExists = await User.findById(user);

    if (!jobExists) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const application = new Application({ job, user, coverLetter });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's applications
router.get('/user/:userId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const applications = await Application.find({ user: req.params.userId }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;