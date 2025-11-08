const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../config/multer');
const { authenticate } = require('../middleware/auth');

// POST /upload-avatar - Upload avatar (cần authentication)
router.post('/upload-avatar', authenticate, upload.single('avatar'), uploadController.uploadAvatar);

// DELETE /delete-avatar - Xóa avatar (cần authentication)
router.delete('/delete-avatar', authenticate, uploadController.deleteAvatar);

module.exports = router;
