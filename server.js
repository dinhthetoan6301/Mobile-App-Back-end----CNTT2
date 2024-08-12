require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const users = require('./routes/users');
const jobs = require('./routes/jobs');
const applications = require('./routes/applications');
const userProfiles = require('./routes/userProfiles');
const companyProfiles = require('./routes/companyProfiles');
const cvRoutes = require('./routes/cvRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Job Finder API is running');
});

app.use('/api/users', users);
app.use('/api/jobs', jobs);
app.use('/api/applications', applications);
app.use('/api/user-profiles', userProfiles);
app.use('/api/company-profiles', companyProfiles);
app.use('/api/cvs', cvRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));