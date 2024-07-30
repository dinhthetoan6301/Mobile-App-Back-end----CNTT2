const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: String,
  logo: String,
  industry: String,
  companySize: String,
  founded: Date,
  website: String,
  description: String,
  culture: String,
  benefits: [String]
}, { timestamps: true });

module.exports = mongoose.model('CompanyProfile', CompanyProfileSchema);