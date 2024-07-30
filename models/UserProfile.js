const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  avatar: String,
  phoneNumber: String,
  address: String,
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    from: Date,
    to: Date,
    current: Boolean,
    description: String
  }],
  experience: [{
    title: String,
    company: String,
    location: String,
    from: Date,
    to: Date,
    current: Boolean,
    description: String
  }],
  skills: [String],
  certifications: [{
    name: String,
    issuer: String,
    date: Date
  }],
  achievements: [String]
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);