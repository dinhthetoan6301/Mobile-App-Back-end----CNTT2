const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  benefits: [String],
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  location: String,
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship']
  },
  industry: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicationDeadline: Date,
  numberOfPositions: { type: Number, default: 1 } 
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);