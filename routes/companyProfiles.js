const express = require('express');
const router = express.Router();
const { getCompanyProfile, updateCompanyProfile } = require('../controllers/companyProfileController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCompanyProfile)
  .put(protect, updateCompanyProfile);

module.exports = router;