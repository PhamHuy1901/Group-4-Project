# Cài đặt packages cho Forgot Password và Upload Avatar

Chạy lệnh sau trong terminal backend:

```bash
npm install nodemailer cloudinary multer crypto
```

hoặc 

```bash
npm install nodemailer@6.9.7 cloudinary@1.41.0 multer@1.4.5-lts.1
```

## Packages:
- **nodemailer**: Gửi email reset password
- **cloudinary**: Upload và lưu trữ avatar
- **multer**: Xử lý multipart/form-data (upload file)
- **crypto**: Tạo random token (built-in Node.js, không cần install)
