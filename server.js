require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const users = require('./routes/users');
const jobs = require('./routes/jobs');
const applications = require('./routes/applications');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('Job Finder API is running');
  });

app.use('/api/users', users);
app.use('/api/jobs', jobs);
app.use('/api/applications', applications);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));