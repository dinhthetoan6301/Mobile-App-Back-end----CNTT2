const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Apply for a job
router.post('/', async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's applications
router.get('/user/:userId', async (req, res) => {
  try {
    const applications = await Application.find({ user: req.params.userId }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;