const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');

const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({});
  res.json(jobs);
});

const createJob = asyncHandler(async (req, res) => {
  const job = new Job({
    ...req.body,
    postedBy: req.user._id
  });

  const createdJob = await job.save();
  res.status(201).json(createdJob);
});

const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job) {
    res.json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

const getRecentJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({}).sort({ createdAt: -1 }).limit(5);
  res.json(jobs);
});

module.exports = { getJobs, createJob, getJobById, getRecentJobs };