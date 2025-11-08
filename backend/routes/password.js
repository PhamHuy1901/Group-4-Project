const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// POST /forgot-password - Gửi email reset password
router.post('/forgot-password', passwordController.forgotPassword);

// POST /reset-password - Reset password với token
router.post('/reset-password', passwordController.resetPassword);

// GET /verify-reset-token - Kiểm tra token có hợp lệ không (optional)
router.get('/verify-reset-token', passwordController.verifyResetToken);

module.exports = router;
