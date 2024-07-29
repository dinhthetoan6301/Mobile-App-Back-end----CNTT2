const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  location: String,
  salary: String
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);