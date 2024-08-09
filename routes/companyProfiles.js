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
router.put('/', protect, async (req, res) => {
  try {
    const { companyName, logo, industry, companySize, founded, website, description, culture } = req.body;
    let companyProfile = await CompanyProfile.findOne({ user: req.user._id });
    if (companyProfile) {
      companyProfile = await CompanyProfile.findOneAndUpdate(
        { user: req.user._id },
        {
          companyName,
          logo,
          industry,
          companySize,
          founded,
          website,
          description,
          culture
        },
        { new: true }
      );
    } else {
      companyProfile = new CompanyProfile({
        user: req.user._id,
        companyName,
        logo,
        industry,
        companySize,
        founded,
        website,
        description,
        culture
      });
      await companyProfile.save();
    }
    res.json(companyProfile);
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;