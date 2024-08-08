const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  applicant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Reviewing', 'Interview', 'Offer', 'Rejected'],
    default: 'Pending' 
  },
  detailedStatus: {
    type: String,
    default: ''
  },
  feedback: [{
    from: {
      type: String,
      enum: ['Employer', 'Applicant'],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  cv: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CV'
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);