# API Documentation - User Management with RBAC

## 🔐 Authentication

API sử dụng header `x-user-id` để xác thực (giả lập - trong production nên dùng JWT).

```
x-user-id: <user_id>
```

## 👥 Roles (Phân quyền)

- **user**: User thường - chỉ xem/sửa/xóa thông tin của chính mình
- **admin**: Admin - có toàn quyền quản lý tất cả users

## 📚 API Endpoints

### 1. GET /users - Danh sách người dùng (Admin only)

**Quyền**: Chỉ Admin

**Request:**
```http
GET http://localhost:3001/users
Headers:
  x-user-id: <admin_user_id>
```

**Response:**
```json
[
  {
    "_id": "...",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2025-11-08T...",
    "updatedAt": "2025-11-08T..."
  }
]
```

---

### 2. POST /users - Tạo user mới

**Quyền**: Public (nhưng chỉ admin mới set được role)

**Request:**
```http
POST http://localhost:3001/users
Headers:
  Content-Type: application/json
  x-user-id: <admin_user_id>  // Optional, chỉ cần khi muốn set role

Body:
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "admin"  // Optional, chỉ admin mới set được
}
```

**Response:**
```json
{
  "_id": "...",
  "name": "New User",
  "email": "newuser@example.com",
  "role": "user",
  "createdAt": "2025-11-08T...",
  "updatedAt": "2025-11-08T..."
}
```

---

### 3. PUT /users/:id - Cập nhật user

**Quyền**: Admin hoặc chính user đó

**Request:**
```http
PUT http://localhost:3001/users/507f1f77bcf86cd799439011
Headers:
  Content-Type: application/json
  x-user-id: <your_user_id>

Body:
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "admin"  // Chỉ admin mới thay đổi được role
}
```

---

### 4. DELETE /users/:id - Xóa user

**Quyền**: Admin hoặc chính user đó (tự xóa tài khoản)

**Request:**
```http
DELETE http://localhost:3001/users/507f1f77bcf86cd799439011
Headers:
  x-user-id: <your_user_id>
```

**Response:**
```json
{
  "message": "User deleted successfully",
  "deletedUser": {
    "id": "507f1f77bcf86cd799439011",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

---

### 5. GET /profile/:id - Xem thông tin cá nhân

**Quyền**: Admin hoặc chính user đó

**Request:**
```http
GET http://localhost:3001/profile/507f1f77bcf86cd799439011
Headers:
  x-user-id: <your_user_id>
```

---

### 6. PUT /profile/:id - Cập nhật thông tin cá nhân

**Quyền**: Admin hoặc chính user đó

**Request:**
```http
PUT http://localhost:3001/profile/507f1f77bcf86cd799439011
Headers:
  Content-Type: application/json
  x-user-id: <your_user_id>

Body:
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "currentPassword": "oldpassword",  // Bắt buộc nếu đổi password
  "newPassword": "newpassword123"    // Optional
}
```

---

## 🚀 Testing

### 1. Tạo admin và user mẫu:

```bash
node seedAdmin.js
```

Kết quả:
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### 2. Test với Postman/Thunder Client:

**Test 1: Admin xem danh sách users**
```
GET http://localhost:3001/users
Header: x-user-id: <admin_id>
✅ Success (200)
```

**Test 2: User thường xem danh sách users**
```
GET http://localhost:3001/users
Header: x-user-id: <user_id>
❌ 403 Forbidden (Admin access required)
```

**Test 3: User xóa chính tài khoản của mình**
```
DELETE http://localhost:3001/users/<user_id>
Header: x-user-id: <user_id>
✅ Success (200)
```

**Test 4: User xóa tài khoản người khác**
```
DELETE http://localhost:3001/users/<other_user_id>
Header: x-user-id: <user_id>
❌ 403 Forbidden (Access denied)
```

**Test 5: Admin xóa bất kỳ user nào**
```
DELETE http://localhost:3001/users/<any_user_id>
Header: x-user-id: <admin_id>
✅ Success (200)
```

---

## 🔒 Error Responses

### 401 Unauthorized
```json
{
  "error": "Authentication required. Please provide x-user-id header"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```
hoặc
```json
{
  "error": "Access denied. Admin or owner access required"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 400 Bad Request
```json
{
  "error": "Email already exists"
}
```

---

## 📝 Notes

1. **Security**: Đây là implementation đơn giản cho mục đích học tập. Production nên dùng JWT tokens.
2. **Password**: Tất cả passwords đều được hash bằng bcrypt trước khi lưu.
3. **Email**: Tự động chuyển thành lowercase và unique.
4. **Validation**: Backend validate tất cả input trước khi xử lý.
