const CV = require('../models/CV');
const asyncHandler = require('express-async-handler');

// @desc    Upload a new CV
// @route   POST /api/cvs
// @access  Private
const uploadCV = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const cv = await CV.create({
    user: req.user._id,
    name: req.file.originalname,
    file: req.file.path
  });

  res.status(201).json(cv);
});

// @desc    Get user's CVs
// @route   GET /api/cvs
// @access  Private
const getCVs = asyncHandler(async (req, res) => {
  const cvs = await CV.find({ user: req.user._id });
  res.json(cvs);
});

// @desc    Delete a CV
// @route   DELETE /api/cvs/:id
// @access  Private
const deleteCV = asyncHandler(async (req, res) => {
  const cv = await CV.findById(req.params.id);

  if (!cv) {
    res.status(404);
    throw new Error('CV not found');
  }

  // Make sure the user owns the CV
  if (cv.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await cv.remove();

  res.json({ message: 'CV removed' });
});

module.exports = {
  uploadCV,
  getCVs,
  deleteCV
};