const asyncHandler = require('express-async-handler');
const UserProfile = require('../models/UserProfile');

// @desc    Get user profile
// @route   GET /api/user-profiles
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const userProfile = await UserProfile.findOne({ user: req.user._id });
  if (userProfile) {
    res.json(userProfile);
  } else {
    res.status(404);
    throw new Error('User profile not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/user-profiles
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  let userProfile = await UserProfile.findOne({ user: req.user._id });

  if (userProfile) {
    userProfile = await UserProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
  } else {
    userProfile = await UserProfile.create({
      user: req.user._id,
      ...req.body
    });
  }

  res.json(userProfile);
});

module.exports = { getUserProfile, updateUserProfile };