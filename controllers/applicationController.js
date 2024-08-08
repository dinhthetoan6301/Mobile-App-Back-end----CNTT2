const Application = require('../models/Application');
const asyncHandler = require('express-async-handler');

// Existing functions (getApplications, createApplication) remain the same

// @desc    Get application status
// @route   GET /api/applications/:id/status
// @access  Private
const getApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check if the user is authorized to view this application
  if (application.applicant.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.json({
    status: application.status,
    detailedStatus: application.detailedStatus
  });
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, detailedStatus } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Only allow the employer (job poster) to update the status
  // You might need to adjust this check based on your auth setup
  if (application.job.postedBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  application.status = status || application.status;
  application.detailedStatus = detailedStatus || application.detailedStatus;

  const updatedApplication = await application.save();

  res.json(updatedApplication);
});

// @desc    Add feedback to an application
// @route   POST /api/applications/:id/feedback
// @access  Private
const addFeedback = asyncHandler(async (req, res) => {
  const { text, from } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check if the user is authorized to add feedback
  if (
    (from === 'Employer' && application.job.postedBy.toString() !== req.user._id.toString()) ||
    (from === 'Applicant' && application.applicant.toString() !== req.user._id.toString())
  ) {
    res.status(401);
    throw new Error('User not authorized');
  }

  application.feedback.push({ from, text });

  const updatedApplication = await application.save();

  res.json(updatedApplication.feedback);
});

// @desc    Get feedback for an application
// @route   GET /api/applications/:id/feedback
// @access  Private
const getFeedback = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check if the user is authorized to view feedback
  if (
    application.applicant.toString() !== req.user._id.toString() &&
    application.job.postedBy.toString() !== req.user._id.toString()
  ) {
    res.status(401);
    throw new Error('User not authorized');
  }

  res.json(application.feedback);
});

module.exports = {
  getApplications,
  createApplication,
  getApplicationStatus,
  updateApplicationStatus,
  addFeedback,
  getFeedback
};