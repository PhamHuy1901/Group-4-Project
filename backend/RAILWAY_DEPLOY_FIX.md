# 🚀 Hướng Dẫn Fix Lỗi và Deploy Backend lên Railway

## ❌ Vấn Đề Đã Gặp
- Lỗi: "Failed to build an image"
- Lỗi: "Add missing jsonwebtoken dependencies"

## ✅ Các Bước Đã Sửa

### 1. Cập nhật `server.js`
- Hỗ trợ cả `MONGODB_URI` (Railway) và `MONGO_URI` (legacy)
- Thêm error handling tốt hơn cho MongoDB connection

### 2. Cập nhật `package.json`
- Thêm `engines` để chỉ định Node.js và npm version
- Đổi `main` từ `index.js` thành `server.js`
- Thêm script `build` (Railway yêu cầu)

### 3. Cập nhật `.gitignore`
- Đảm bảo `package-lock.json` KHÔNG bị ignore
- Railway cần file này để build chính xác

## 🔧 Các Bước Deploy lên Railway

### Bước 1: Tạo package-lock.json (nếu chưa có)
```bash
cd backend
npm install
```

### Bước 2: Commit và Push code lên GitHub
```bash
# Đảm bảo bạn đang ở thư mục backend
git add .
git commit -m "Fix: Update for Railway deployment"
git push origin backend
```

### Bước 3: Deploy trên Railway

1. **Đăng nhập Railway**: https://railway.app
2. **Tạo Project mới**: 
   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
3. **Chọn Repository**: `PhamHuy1901/Group-4---Project`
4. **Chọn Branch**: `backend`
5. **Railway sẽ tự động detect**:
   - Builder: Nixpacks
   - Type: Node.js
   - Start Command: `npm start`

### Bước 4: Thêm Biến Môi Trường

Vào tab **Variables** và thêm:

```env
# MongoDB Connection (bắt buộc)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Secret (bắt buộc)
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary (bắt buộc nếu dùng upload ảnh)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Email Configuration (nếu dùng forgot password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL (cho CORS)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Node Environment
NODE_ENV=production

# Port (Railway tự set, nhưng có thể thêm)
PORT=3001
```

### Bước 5: Deploy

1. Railway sẽ tự động build và deploy
2. Đợi khoảng 2-5 phút
3. Kiểm tra logs để đảm bảo không có lỗi

### Bước 6: Lấy URL Production

1. Vào tab **Settings**
2. Tìm section **Domains**
3. Click **Generate Domain**
4. Railway sẽ tạo URL dạng: `https://group-4-project-production-xxxx.up.railway.app`

### Bước 7: Test API

```bash
# Test health check
curl https://your-railway-url.railway.app/

# Response mong đợi:
{
  "message": "Backend API is running",
  "status": "OK",
  "timestamp": "2025-11-09T..."
}
```

## 🔍 Troubleshooting

### Lỗi: "MONGODB_URI is not defined"
**Giải pháp**: Kiểm tra lại biến môi trường trên Railway
```bash
# Vào Variables tab và đảm bảo có MONGODB_URI
```

### Lỗi: "Module not found"
**Giải pháp**: Đảm bảo package-lock.json được commit
```bash
git add package-lock.json
git commit -m "Add package-lock.json"
git push origin backend
```

### Lỗi: Build timeout
**Giải pháp**: Railway free tier có giới hạn build time. Thử:
1. Xóa deployment cũ
2. Redeploy lại

### Lỗi: Application failed to respond
**Giải pháp**: 
- Kiểm tra logs để xem MongoDB có connect được không
- Đảm bảo MONGODB_URI đúng format
- Kiểm tra MongoDB Atlas có whitelist IP 0.0.0.0/0 (allow all)

## 📝 Checklist Trước Khi Deploy

- [ ] `package.json` có đầy đủ dependencies
- [ ] `package-lock.json` được commit
- [ ] `.gitignore` không ignore `package-lock.json`
- [ ] `server.js` hỗ trợ `MONGODB_URI`
- [ ] Đã test local bằng `npm start`
- [ ] MongoDB Atlas whitelist IP 0.0.0.0/0
- [ ] Đã có tất cả environment variables

## 🎯 Kết Quả Mong Đợi

Sau khi deploy thành công:
- ✅ Railway cung cấp URL public
- ✅ API có thể truy cập từ browser/Postman
- ✅ MongoDB kết nối thành công
- ✅ Frontend có thể gọi API

## 📱 Update Frontend

Sau khi có Railway URL, cập nhật frontend:

```javascript
// frontend/src/api.js
const API_URL = process.env.REACT_APP_API_URL || 
  'https://group-4-project-production-xxxx.up.railway.app';
```

Và thêm biến môi trường vào Vercel:
```env
REACT_APP_API_URL=https://group-4-project-production-xxxx.up.railway.app
```

## 🚨 Lưu Ý Quan Trọng

1. **Railway Free Tier**:
   - 500 giờ execution time/tháng
   - $5 credit khi đăng ký
   - Sau khi hết credit, service sẽ sleep

2. **MongoDB Atlas Free Tier**:
   - 512MB storage
   - Shared CPU
   - Phải whitelist IP

3. **Cloudinary Free Tier**:
   - 25 credits/tháng
   - ~25,000 images

## 📞 Support

Nếu vẫn gặp lỗi, check:
1. Railway build logs
2. Railway deployment logs
3. MongoDB Atlas connection status
4. GitHub repository có đầy đủ files chưa
