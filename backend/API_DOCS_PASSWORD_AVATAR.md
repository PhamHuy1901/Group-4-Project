# API Documentation - Password Reset & Avatar Upload

## 🔐 Password Reset APIs

### 1. POST /password/forgot-password - Gửi email reset password

**Request:**
```http
POST http://localhost:3001/password/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response Success:**
```json
{
  "message": "Password reset email sent successfully",
  "debug": {
    "token": "abc123..." // Chỉ hiển thị trong development mode
  }
}
```

---

### 2. POST /password/reset-password - Reset password với token

**Request:**
```http
POST http://localhost:3001/password/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "newPassword": "newpassword123"
}
```

**Response Success:**
```json
{
  "message": "Password reset successfully. You can now login with your new password."
}
```

**Response Error:**
```json
{
  "error": "Invalid or expired reset token"
}
```

---

### 3. GET /password/verify-reset-token - Kiểm tra token hợp lệ

**Request:**
```http
GET http://localhost:3001/password/verify-reset-token?token=abc123...
```

**Response Success:**
```json
{
  "valid": true,
  "message": "Token is valid",
  "email": "user@example.com"
}
```

---

## 📸 Avatar Upload APIs

### 1. POST /upload/upload-avatar - Upload avatar

**Quyền**: Cần authentication (header `x-user-id`)

**Request:**
```http
POST http://localhost:3001/upload/upload-avatar
Headers:
  x-user-id: <user_id>
  Content-Type: multipart/form-data

Body (form-data):
  avatar: <file> (image file: jpg, png, gif, webp - max 5MB)
```

**Response Success:**
```json
{
  "message": "Avatar uploaded successfully",
  "avatar": "https://res.cloudinary.com/xxx/image/upload/v123/user-avatars/user_xxx.jpg",
  "user": {
    "_id": "...",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "https://res.cloudinary.com/xxx/...",
    "role": "user"
  }
}
```

**Response Error:**
```json
{
  "error": "No file uploaded"
}
```
hoặc
```json
{
  "error": "Only image files are allowed (jpeg, jpg, png, gif, webp)"
}
```

---

### 2. DELETE /upload/delete-avatar - Xóa avatar

**Quyền**: Cần authentication

**Request:**
```http
DELETE http://localhost:3001/upload/delete-avatar
Headers:
  x-user-id: <user_id>
```

**Response Success:**
```json
{
  "message": "Avatar deleted successfully",
  "user": {
    "_id": "...",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": null,
    "role": "user"
  }
}
```

---

## 🔧 Setup Instructions

### 1. Cài đặt packages:
```bash
npm install nodemailer cloudinary multer
```

### 2. Cấu hình Gmail App Password:
1. Truy cập: https://myaccount.google.com/apppasswords
2. Tạo App Password mới
3. Copy password và thêm vào `.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
```

### 3. Cấu hình Cloudinary:
1. Đăng ký tài khoản tại: https://cloudinary.com/
2. Vào Dashboard, copy credentials
3. Thêm vào `.env`:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🧪 Testing

### Test Forgot Password:
```bash
curl -X POST http://localhost:3001/password/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Test Reset Password:
```bash
curl -X POST http://localhost:3001/password/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"your-token","newPassword":"newpass123"}'
```

### Test Upload Avatar (với Postman/Thunder Client):
1. Method: POST
2. URL: http://localhost:3001/upload/upload-avatar
3. Headers: `x-user-id: <your_user_id>`
4. Body: form-data, key="avatar", type=File, chọn file ảnh

---

## 📝 Notes

### Password Reset Flow:
1. User nhập email → gọi `/forgot-password`
2. Backend gửi email chứa link với token
3. User click link → frontend hiển thị form reset password
4. User nhập password mới + token → gọi `/reset-password`
5. Backend verify token và cập nhật password

### Avatar Upload Features:
- ✅ Tự động resize ảnh về 400x400px
- ✅ Crop focus vào mặt người
- ✅ Tối ưu chất lượng và format
- ✅ Xóa avatar cũ khi upload mới
- ✅ Giới hạn kích thước 5MB
- ✅ Chỉ cho phép ảnh (jpg, png, gif, webp)

### Security:
- Reset token được hash trước khi lưu database
- Token expire sau 1 giờ
- Email không tiết lộ thông tin user có tồn tại hay không
- Avatar upload yêu cầu authentication
