const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: String,
  location: String,
  skills: [String],
  experience: [{
    title: String,
    company: String,
    from: Date,
    to: Date,
    current: Boolean,
    description: String
  }],
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    from: Date,
    to: Date,
    current: Boolean,
    description: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);