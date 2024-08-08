const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');

const createApplication = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;

  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    coverLetter,
  });

  res.status(201).json(application);
});

const getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id }).populate('job');
  res.json(applications);
});

const getApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.applicant.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json({ status: application.status, detailedStatus: application.detailedStatus });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, detailedStatus } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.job.postedBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  application.status = status || application.status;
  application.detailedStatus = detailedStatus || application.detailedStatus;

  const updatedApplication = await application.save();

  res.json(updatedApplication);
});

const addFeedback = asyncHandler(async (req, res) => {
  const { text, from } = req.body;

  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (
    (from === 'employer' && application.job.postedBy.toString() !== req.user._id.toString()) ||
    (from === 'applicant' && application.applicant.toString() !== req.user._id.toString())
  ) {
    res.status(401);
    throw new Error('Not authorized');
  }

  application.feedback.push({ text, from });

  await application.save();

  res.status(201).json(application.feedback);
});

const getFeedback = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (
    application.applicant.toString() !== req.user._id.toString() &&
    application.job.postedBy.toString() !== req.user._id.toString()
  ) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(application.feedback);
});

module.exports = {
  createApplication,
  getApplications,
  getApplicationStatus,
  updateApplicationStatus,
  addFeedback,
  getFeedback
};