# API Documentation - User Management with JWT Authentication

## 🔐 Authentication

API sử dụng **JWT (JSON Web Token)** với cơ chế Access Token + Refresh Token:

### Access Token
- **Header**: `Authorization: Bearer <access_token>`
- **Thời gian sống**: 15 phút (default)
- **Mục đích**: Xác thực các API requests

### Refresh Token
- **Lưu trữ**: Client side (localStorage/cookie)
- **Thời gian sống**: 7 ngày (default)
- **Mục đích**: Làm mới Access Token khi hết hạn

### Legacy Authentication (Backward Compatibility)
Vẫn hỗ trợ header `x-user-id` cho development/testing:
```
x-user-id: <user_id>
```

## 👥 Roles (Phân quyền)

- **user**: User thường - chỉ xem/sửa/xóa thông tin của chính mình
- **admin**: Admin - có toàn quyền quản lý tất cả users

## 📚 API Endpoints

---

## 🔑 Authentication Endpoints

### 1. POST /auth/signup - Đăng ký tài khoản

**Quyền**: Public

**Request:**
```http
POST http://localhost:3001/auth/signup
Headers:
  Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Signup success",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-11-09T..."
  }
}
```

---

### 2. POST /auth/login - Đăng nhập

**Quyền**: Public

**Request:**
```http
POST http://localhost:3001/auth/login
Headers:
  Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-11-09T..."
  }
}
```

---

### 3. POST /auth/refresh - Làm mới Access Token

**Quyền**: Public (cần Refresh Token)

**Request:**
```http
POST http://localhost:3001/auth/refresh
Headers:
  Content-Type: application/json

Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401 Unauthorized`: Refresh token expired hoặc invalid
- `401 REFRESH_TOKEN_EXPIRED`: Client nên redirect đến login

---

### 4. POST /auth/logout - Đăng xuất

**Quyền**: Public

**Request:**
```http
POST http://localhost:3001/auth/logout
Headers:
  Content-Type: application/json

Body:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Logout success, refresh token revoked"
}
```

**Note**: Client phải xóa cả accessToken và refreshToken khỏi localStorage/cookie.

---

## 👥 User Management Endpoints

### 1. GET /users - Danh sách người dùng (Admin only)

**Quyền**: Chỉ Admin

**Request:**
```http
GET http://localhost:3001/users
Headers:
  Authorization: Bearer <access_token>
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
  Authorization: Bearer <access_token>  # Optional, chỉ cần khi muốn set role

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
  Authorization: Bearer <access_token>

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
  Authorization: Bearer <access_token>
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

## 👤 Profile Endpoints

### 5. GET /profile/:id - Xem thông tin cá nhân

**Quyền**: Admin hoặc chính user đó

**Request:**
```http
GET http://localhost:3001/profile/507f1f77bcf86cd799439011
Headers:
  Authorization: Bearer <access_token>
```

---

### 6. PUT /profile/:id - Cập nhật thông tin cá nhân

**Quyền**: Admin hoặc chính user đó

**Request:**
```http
PUT http://localhost:3001/profile/507f1f77bcf86cd799439011
Headers:
  Content-Type: application/json
  Authorization: Bearer <access_token>

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

### 2. Test Flow với JWT:

**Step 1: Login để lấy tokens**
```http
POST http://localhost:3001/auth/login
Body: { "email": "admin@example.com", "password": "admin123" }

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {...}
}
```

**Step 2: Sử dụng Access Token để gọi API**
```http
GET http://localhost:3001/users
Header: Authorization: Bearer eyJhbGc...
✅ Success (200)
```

**Step 3: Khi Access Token hết hạn (sau 15 phút)**
```http
GET http://localhost:3001/users
Header: Authorization: Bearer <expired_token>
❌ 401 Unauthorized { "code": "TOKEN_EXPIRED" }
```

**Step 4: Refresh Access Token**
```http
POST http://localhost:3001/auth/refresh
Body: { "refreshToken": "eyJhbGc..." }

Response:
{
  "accessToken": "eyJhbGc...",  // Token mới
  "refreshToken": "eyJhbGc..."
}
```

**Step 5: Logout (revoke refresh token)**
```http
POST http://localhost:3001/auth/logout
Body: { "refreshToken": "eyJhbGc..." }
✅ Success - Token đã bị thu hồi
```

### 3. Test với Postman/Thunder Client:

**Test 1: Admin xem danh sách users**
```
GET http://localhost:3001/users
Header: Authorization: Bearer <admin_access_token>
✅ Success (200)
```

**Test 2: User thường xem danh sách users**
```
GET http://localhost:3001/users
Header: Authorization: Bearer <user_access_token>
❌ 403 Forbidden (Admin access required)
```

**Test 3: User xóa chính tài khoản của mình**
```
DELETE http://localhost:3001/users/<user_id>
Header: Authorization: Bearer <user_access_token>
✅ Success (200)
```

**Test 4: User xóa tài khoản người khác**
```
DELETE http://localhost:3001/users/<other_user_id>
Header: Authorization: Bearer <user_access_token>
❌ 403 Forbidden (Access denied)
```

**Test 5: Admin xóa bất kỳ user nào**
```
DELETE http://localhost:3001/users/<any_user_id>
Header: Authorization: Bearer <admin_access_token>
✅ Success (200)
```

**Test 6: Sử dụng expired Refresh Token**
```
POST http://localhost:3001/auth/refresh
Body: { "refreshToken": "<expired_refresh_token>" }
❌ 401 Unauthorized { "code": "REFRESH_TOKEN_EXPIRED" }
→ Client redirect to login page
```

---

## 🔒 Error Responses

### 401 Unauthorized - Access Token Issues
```json
{
  "error": "Access token required"
}
```
```json
{
  "error": "Access token expired",
  "code": "TOKEN_EXPIRED"
}
```
```json
{
  "error": "Invalid access token"
}
```

### 401 Unauthorized - Refresh Token Issues
```json
{
  "error": "Refresh token required"
}
```
```json
{
  "error": "Refresh token expired",
  "code": "REFRESH_TOKEN_EXPIRED"
}
```
```json
{
  "error": "Invalid or expired refresh token"
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

## � Security Features

### 1. JWT Access Token + Refresh Token
- **Access Token**: Thời gian sống ngắn (15 phút) để giảm thiểu rủi ro nếu bị đánh cắp
- **Refresh Token**: Thời gian sống dài (7 ngày) nhưng được lưu trong database
- **Token Rotation**: Có thể bật để refresh token mới sau mỗi lần refresh (set `ROTATE_REFRESH_TOKEN=true`)

### 2. Refresh Token Storage
- Lưu trữ trong database với thông tin:
  - Token value
  - Created timestamp
  - Expiration timestamp
- Tự động xóa tokens đã hết hạn
- Giới hạn tối đa 5 tokens/user (support 5 devices)

### 3. Token Revocation
- Logout sẽ xóa refresh token khỏi database
- Token không thể sử dụng sau khi bị revoke
- Support cho tính năng "Logout All Devices"

### 4. Environment Variables
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES=7d
ROTATE_REFRESH_TOKEN=false
```

---

## 📝 Notes

1. **Security**: Production-ready JWT implementation với Access Token + Refresh Token
2. **Password**: Tất cả passwords đều được hash bằng bcrypt trước khi lưu
3. **Email**: Tự động chuyển thành lowercase và unique
4. **Validation**: Backend validate tất cả input trước khi xử lý
5. **Token Storage**: 
   - Client: Lưu cả accessToken và refreshToken (localStorage/cookie)
   - Server: Chỉ lưu refreshToken trong database
6. **Backward Compatibility**: Vẫn hỗ trợ header `x-user-id` cho testing

---

## 🔄 Token Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  LOGIN                                                        │
│  ───────                                                      │
│  POST /auth/login                                             │
│  → Returns: { accessToken, refreshToken, user }              │
│                                                               │
│  Client stores both tokens                                   │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  API REQUESTS                                                 │
│  ─────────────                                               │
│  GET /users                                                   │
│  Header: Authorization: Bearer <accessToken>                 │
│                                                               │
│  If accessToken valid → ✅ Success                           │
│  If accessToken expired → ❌ 401 TOKEN_EXPIRED               │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  REFRESH TOKEN                                                │
│  ──────────────                                              │
│  POST /auth/refresh                                           │
│  Body: { refreshToken }                                       │
│  → Returns: { accessToken, refreshToken }                    │
│                                                               │
│  Client updates tokens → Retry API request                   │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  LOGOUT                                                       │
│  ───────                                                      │
│  POST /auth/logout                                            │
│  Body: { refreshToken }                                       │
│  → Server revokes refresh token from database                │
│                                                               │
│  Client deletes both tokens                                  │
└─────────────────────────────────────────────────────────────┘
```
