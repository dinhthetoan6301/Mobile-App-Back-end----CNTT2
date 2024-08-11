const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['jobseeker', 'employer'],
    required: true
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  bio: String,
  phone: String,
  cvs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CV'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);