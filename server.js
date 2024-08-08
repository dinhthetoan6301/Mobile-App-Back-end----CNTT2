const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('Importing routes');
const usersRouter = require('./routes/users');
const jobsRouter = require('./routes/jobs');
const applicationsRouter = require('./routes/applications');
const userProfilesRouter = require('./routes/userProfiles');
const companyProfilesRouter = require('./routes/companyProfiles');

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
console.log('Users router:', usersRouter);
app.use('/api/users', usersRouter);
console.log('Jobs router:', jobsRouter);
app.use('/api/jobs', jobsRouter);
console.log('Applications router:', applicationsRouter);
app.use('/api/applications', applicationsRouter);
console.log('User profiles router:', userProfilesRouter);
app.use('/api/user-profiles', userProfilesRouter);
console.log('Company profiles router:', companyProfilesRouter);
app.use('/api/company-profiles', companyProfilesRouter);
console.log('Routes set up');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;