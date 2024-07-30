const express = require('express');
const router = express.Router();
const CompanyProfile = require('../models/CompanyProfile');
const { protect } = require('../middleware/authMiddleware');

// Get company profile
router.get('/', protect, async (req, res) => {
  try {
    const companyProfile = await CompanyProfile.findOne({ user: req.user._id });
    if (companyProfile) {
      res.json(companyProfile);
    } else {
      res.status(404).json({ message: 'Company profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update company profile
router.post('/', protect, async (req, res) => {
  try {
    let companyProfile = await CompanyProfile.findOne({ user: req.user._id });
    if (companyProfile) {
      companyProfile = await CompanyProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: req.body },
        { new: true }
      );
    } else {
      companyProfile = new CompanyProfile({
        user: req.user._id,
        ...req.body
      });
      await companyProfile.save();
    }
    res.json(companyProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;