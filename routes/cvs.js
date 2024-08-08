const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

console.log('Setting up users routes');

const {
  uploadCV,
  getCVs,
  deleteCV
} = require('../controllers/cvController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', protect, upload.single('cv'), uploadCV);
router.get('/', protect, getCVs);
router.delete('/:id', protect, deleteCV);

module.exports = router;