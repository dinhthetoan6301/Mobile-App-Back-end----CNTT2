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
    default: 'jobseeker'
  },
  dateOfBirth: Date,
  bio: String,
  phone: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);