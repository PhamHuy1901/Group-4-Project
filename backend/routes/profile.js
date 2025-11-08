const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// GET /profile/:id - Xem thông tin cá nhân
router.get('/:id', profileController.getProfile);

// PUT /profile/:id - Cập nhật thông tin cá nhân
router.put('/:id', profileController.updateProfile);

module.exports = router;
