const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const { protect } = require('../middleware/authMiddleware');

// Get user profile
router.get('/', protect, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.user._id });
    if (userProfile) {
      res.json(userProfile);
    } else {
      res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update user profile
router.post('/', protect, async (req, res) => {
  try {
    let userProfile = await UserProfile.findOne({ user: req.user._id });
    if (userProfile) {
      userProfile = await UserProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: req.body },
        { new: true }
      );
    } else {
      userProfile = new UserProfile({
        user: req.user._id,
        ...req.body
      });
      await userProfile.save();
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;