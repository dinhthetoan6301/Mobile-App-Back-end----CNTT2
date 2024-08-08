const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userProfileController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;