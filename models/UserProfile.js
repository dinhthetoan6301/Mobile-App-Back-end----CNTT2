const mongoose = require('mongoose');
const UserProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  email: String,
  phoneNumber: String,
  address: String,
  company: String,
  avatar: String
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);