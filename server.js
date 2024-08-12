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
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });



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
app.use('/api/cvs', upload.single('cv'), cvRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));