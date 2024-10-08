const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const CV = require('../models/CV');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/cvs/';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});


router.post('/upload', protect, upload.single('cv'), async (req, res) => {
  console.log('File upload request received');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  
  if (!req.file) {
    console.log('No file received');
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  console.log('File received:', req.file);

  try {
    const newCV = new CV({
      user: req.user._id,
      name: req.file.originalname,
      path: req.file.path
    });

    console.log('Saving new CV:', newCV);
    await newCV.save();

    console.log('Updating user with new CV');
    await User.findByIdAndUpdate(req.user._id, {
      $push: { cvs: newCV._id }
    });

    console.log('CV upload successful');
    res.status(200).json({
      success: true,
      message: 'CV uploaded successfully',
      cv: {
        id: newCV._id,
        name: newCV.name
      }
    });
  } catch (error) {
    console.error('Error uploading CV:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cvs');
    res.json(user.cvs);
  } catch (error) {
    console.error('Error fetching CVs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

   
    if (cv.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    fs.unlink(cv.path, async (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      }
      
     
      await cv.remove();

      await User.findByIdAndUpdate(req.user._id, {
        $pull: { cvs: req.params.id }
      });

      res.json({ message: 'CV removed' });
    });
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;