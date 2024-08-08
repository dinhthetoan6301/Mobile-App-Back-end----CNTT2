console.log('Loading server.js');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('Importing routes');
const users = require('./routes/users');
const jobs = require('./routes/jobs');
const applications = require('./routes/applications');
const userProfiles = require('./routes/userProfiles');
const companyProfiles = require('./routes/companyProfiles');

console.log('Routes imported');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Job Finder API is running');
});

console.log('Setting up routes');
app.use('/api/users', users);
app.use('/api/jobs', jobs);
app.use('/api/applications', applications);
app.use('/api/user-profiles', userProfiles);
app.use('/api/company-profiles', companyProfiles);
console.log('Routes set up');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;