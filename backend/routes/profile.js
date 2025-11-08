const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate, requireAdminOrOwner } = require('../middleware/auth');

// GET /profile/:id - Xem thông tin cá nhân (cần xác thực)
router.get('/:id', authenticate, requireAdminOrOwner, profileController.getProfile);

// PUT /profile/:id - Cập nhật thông tin cá nhân (chỉ admin hoặc chính user đó)
router.put('/:id', authenticate, requireAdminOrOwner, profileController.updateProfile);

module.exports = router;
