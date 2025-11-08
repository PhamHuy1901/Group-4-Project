const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requireAdmin, requireAdminOrOwner, optionalAuth } = require('../middleware/auth');

// GET /users - Chỉ Admin mới xem được danh sách tất cả users
router.get('/', authenticate, requireAdmin, userController.getUsers);

// POST /users - Tạo user mới (public - không cần xác thực để đăng ký)
router.post('/', userController.createUser);

// PUT /users/:id - Admin hoặc chính user đó mới update được
router.put('/:id', authenticate, requireAdminOrOwner, userController.updateUser);

// DELETE /users/:id - Admin hoặc chính user đó mới xóa được
router.delete('/:id', authenticate, requireAdminOrOwner, userController.deleteUser);

module.exports = router;