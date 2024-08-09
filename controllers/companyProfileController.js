const asyncHandler = require('express-async-handler');
const CompanyProfile = require('../models/CompanyProfile');

// @desc    Get company profile
// @route   GET /api/company-profiles
// @access  Private
const getCompanyProfile = asyncHandler(async (req, res) => {
  const companyProfile = await CompanyProfile.findOne({ user: req.user._id });
  if (companyProfile) {
    res.json(companyProfile);
  } else {
    res.status(404);
    throw new Error('Company profile not found');
  }
});

// @desc    Create or update company profile
// @route   PUT /api/company-profiles
// @access  Private
const updateCompanyProfile = asyncHandler(async (req, res) => {
  let companyProfile = await CompanyProfile.findOne({ user: req.user._id });

  if (companyProfile) {
    companyProfile = await CompanyProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
  } else {
    companyProfile = await CompanyProfile.create({
      user: req.user._id,
      ...req.body
    });
  }

  res.json(companyProfile);
});

module.exports = { getCompanyProfile, updateCompanyProfile };