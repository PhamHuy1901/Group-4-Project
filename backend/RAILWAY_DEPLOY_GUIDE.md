# 🚂 HƯỚNG DẪN DEPLOY BACKEND LÊN RAILWAY - CHI TIẾT

Railway là platform deploy hiện đại, tự động detect và build, rất dễ sử dụng!

---

## 📦 BƯỚC 1: PUSH CODE LÊN GITHUB

### 1.1. Kiểm tra Git status
```powershell
cd d:\Phat_Trien_MNM\Buoi4_TH_Nhom\Group-4---Project
git status
```

### 1.2. Add và Commit code
```powershell
# Add tất cả thay đổi
git add .

# Commit với message
git commit -m "Add Railway configuration for deployment"

# Push lên GitHub
git push origin backend
```

**✅ Xác nhận:** Code đã được push lên GitHub repository `Group-4---Project`

---

## 🚂 BƯỚC 2: TẠO PROJECT TRÊN RAILWAY

### 2.1. Đăng nhập Railway
1. Truy cập: **https://railway.app**
2. Click **"Login"** (góc trên bên phải)
3. Chọn **"Login with GitHub"**
4. Cho phép Railway truy cập GitHub repositories

### 2.2. Tạo New Project
1. Sau khi đăng nhập, click **"New Project"** (nút lớn ở giữa hoặc "+ New Project" góc trên)
2. Chọn **"Deploy from GitHub repo"**

### 2.3. Chọn Repository
1. Railway sẽ hiện danh sách repositories
2. Tìm và chọn: **`Group-4---Project`**
3. Nếu không thấy repo:
   - Click **"Configure GitHub App"**
   - Cho phép Railway truy cập repo cụ thể
   - Quay lại và chọn repo

### 2.4. Cấu hình Deploy

Railway sẽ hiện màn hình cấu hình:

**Root Directory:**
- Nhập: `backend` 
- (Railway sẽ chỉ build code trong thư mục này)

**Branch:**
- Chọn: `backend`

**Click:** **"Deploy Now"** hoặc **"Add variables"** (để thêm env variables trước)

---

## 🔐 BƯỚC 3: THÊM ENVIRONMENT VARIABLES

### 3.1. Mở Settings
Sau khi tạo project:
1. Click vào project vừa tạo
2. Click tab **"Variables"** (bên trái)
3. Hoặc click **"Settings"** → **"Variables"**

### 3.2. Thêm từng biến môi trường

Click **"New Variable"** và thêm các biến sau:

#### **Variable 1: MONGO_URI**
```
Key: MONGO_URI
Value: mongodb+srv://levanhau2019cm_db_user:0946483539@vanhau.yrzkk4d.mongodb.net/groupDB?retryWrites=true&w=majority&appName=VanHau
```

#### **Variable 2: JWT_SECRET**
```
Key: JWT_SECRET
Value: your-super-secret-jwt-key-change-this-in-production
```
⚠️ **Khuyến nghị:** Đổi thành chuỗi ngẫu nhiên mạnh hơn cho production

#### **Variable 3: JWT_EXPIRES**
```
Key: JWT_EXPIRES
Value: 7d
```

#### **Variable 4: EMAIL_USER**
```
Key: EMAIL_USER
Value: hahaudem@gmail.com
```

#### **Variable 5: EMAIL_PASSWORD**
```
Key: EMAIL_PASSWORD
Value: gqii sdik hrxd vkkp
```

#### **Variable 6: EMAIL_FROM_NAME**
```
Key: EMAIL_FROM_NAME
Value: Github_Team
```

#### **Variable 7: CLOUDINARY_CLOUD_NAME**
```
Key: CLOUDINARY_CLOUD_NAME
Value: dwk0vmnu5
```

#### **Variable 8: CLOUDINARY_API_KEY**
```
Key: CLOUDINARY_API_KEY
Value: 925753278185974
```

#### **Variable 9: CLOUDINARY_API_SECRET**
```
Key: CLOUDINARY_API_SECRET
Value: h4iYBpF7TgAZGSxeuwheenPPKgQ
```

#### **Variable 10: FRONTEND_URL**
```
Key: FRONTEND_URL
Value: http://localhost:3000
```
📝 **Ghi chú:** Sẽ update sau khi deploy frontend

#### **Variable 11: NODE_ENV**
```
Key: NODE_ENV
Value: production
```

#### **Variable 12: PORT** (Tùy chọn - Railway tự assign)
```
Key: PORT
Value: 3001
```

### 3.3. Deploy/Redeploy
Sau khi thêm xong tất cả variables:
- Railway sẽ **tự động trigger deploy** mới
- Hoặc click **"Deploy"** trong phần Deployments

---

## 📊 BƯỚC 4: THEO DÕI QUÁ TRÌNH DEPLOY

### 4.1. Xem Build Logs
1. Click tab **"Deployments"** (bên trái)
2. Click vào deployment đang chạy
3. Xem **Build Logs** và **Deploy Logs**

### 4.2. Logs mong đợi
```
Building...
==> Installing dependencies
==> Running npm install
==> Build completed successfully

Starting...
==> Running npm start
🚀 Server running on port 3001
📝 Environment: production
MongoDB connected

==> Service is live!
```

### 4.3. Kiểm tra Status
- Đợi status chuyển sang: **✅ Active**
- Nếu có lỗi, status sẽ là: **❌ Failed** hoặc **⚠️ Crashed**

---

## 🌐 BƯỚC 5: LẤY URL VÀ TEST API

### 5.1. Lấy Public URL
1. Trong project dashboard
2. Click tab **"Settings"** 
3. Scroll xuống phần **"Domains"** hoặc **"Networking"**
4. Click **"Generate Domain"** (nếu chưa có)
5. Railway sẽ tạo URL dạng: `https://group-4-backend.up.railway.app`

**Hoặc:**
- Vào tab **"Deployments"**
- Click vào deployment thành công
- Copy URL từ phần **"Domain"**

### 5.2. Test Health Check
Mở trình duyệt hoặc Postman:

**Request:**
```
GET https://group-4-backend.up.railway.app/
```

**Response mong đợi:**
```json
{
  "message": "Backend API is running",
  "status": "OK",
  "timestamp": "2025-11-09T..."
}
```

### 5.3. Test Auth Endpoint
```
POST https://group-4-backend.up.railway.app/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

**Response mong đợi:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc..."
}
```

---

## ✅ BƯỚC 6: CẬP NHẬT FRONTEND

### 6.1. Update API URL
Cập nhật file `frontend/src/api.js`:

```javascript
// Thay đổi từ:
const API_URL = 'https://group-4-backend.onrender.com';

// Thành:
const API_URL = 'https://group-4-backend.up.railway.app';
```

### 6.2. Push changes
```powershell
git add frontend/src/api.js
git commit -m "Update API URL to Railway"
git push origin backend
```

---

## 🎯 BƯỚC 7: CẤU HÌNH NÂNG CAO (TÙY CHỌN)

### 7.1. Custom Domain
1. Vào **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Nhập domain của bạn (ví dụ: `api.yourdomain.com`)
4. Cấu hình DNS theo hướng dẫn của Railway

### 7.2. Auto Deploy
Railway mặc định bật **Auto Deploy**:
- Mỗi khi push code mới lên branch `backend`
- Railway tự động build và deploy

**Để tắt Auto Deploy:**
1. Vào **Settings** → **Service Settings**
2. Toggle off **"Automatically deploy changes"**

### 7.3. Monitoring & Metrics
1. Tab **"Metrics"** - Xem CPU, RAM, Network usage
2. Tab **"Logs"** - Xem real-time logs
3. Click **"View Logs"** để xem chi tiết

---

## 🔧 TROUBLESHOOTING - XỬ LÝ LỖI

### ❌ Lỗi 1: Build Failed
**Triệu chứng:**
```
Error: Cannot find module 'express'
Build failed
```

**Giải pháp:**
- Kiểm tra `backend/package.json` có đầy đủ dependencies
- Đảm bảo **Root Directory** = `backend`
- Check logs để tìm module nào thiếu

---

### ❌ Lỗi 2: Application Error / Crashed
**Triệu chứng:**
```
Application Error
Your application crashed
```

**Giải pháp:**
1. Check **Deploy Logs**:
   ```
   MongooseError: Cannot connect to MongoDB
   ```
2. Kiểm tra:
   - ✅ Biến `MONGO_URI` đã thêm chưa?
   - ✅ MongoDB Atlas đã whitelist IP `0.0.0.0/0`?
   - ✅ Tất cả Environment Variables đã đầy đủ?

---

### ❌ Lỗi 3: 502 Bad Gateway
**Triệu chứng:**
- Truy cập URL báo lỗi 502

**Giải pháp:**
1. Service có thể đang restart
2. Đợi 1-2 phút
3. Check Deploy Status
4. Xem Logs để tìm lỗi

---

### ❌ Lỗi 4: CORS Error từ Frontend
**Triệu chứng:**
```
Access to fetch has been blocked by CORS policy
```

**Giải pháp:**
1. Cập nhật `FRONTEND_URL` trên Railway
2. Hoặc sửa `backend/server.js`:
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'https://your-frontend.vercel.app',
     process.env.FRONTEND_URL
   ];
   ```
3. Push code và deploy lại

---

## 📊 SO SÁNH RAILWAY VS RENDER

| Tính năng | Railway | Render |
|-----------|---------|--------|
| **Tốc độ deploy** | ⚡ Rất nhanh (1-2 phút) | 🐌 Chậm hơn (3-5 phút) |
| **Auto detect** | ✅ Tự động hoàn toàn | ⚠️ Cần cấu hình thủ công |
| **Free tier** | ⚠️ $5 credit/tháng | ✅ 750 giờ/tháng free |
| **Sleep time** | ✅ Không sleep | ⚠️ Sleep sau 15 phút |
| **Cold start** | ⚡ Rất nhanh | 🐌 30-60 giây |
| **UI/UX** | ✅ Hiện đại, dễ dùng | ⚠️ Phức tạp hơn |
| **Database** | ✅ Có built-in DB | ❌ Cần external DB |
| **Logs** | ✅ Real-time, đẹp | ⚠️ Cơ bản |
| **Monitoring** | ✅ Metrics built-in | ⚠️ Hạn chế |

**Khuyến nghị:**
- **Railway**: Nếu cần performance tốt, không sleep, deploy nhanh
- **Render**: Nếu cần free tier lâu dài, không lo credit

---

## 📌 CHECKLIST HOÀN THÀNH

- [ ] Code đã push lên GitHub branch `backend`
- [ ] Đã tạo project trên Railway.app
- [ ] Đã chọn repository và branch đúng
- [ ] Root Directory = `backend`
- [ ] Đã thêm đầy đủ 11 Environment Variables
- [ ] MongoDB Atlas whitelist IP `0.0.0.0/0`
- [ ] Deploy thành công (Status: Active)
- [ ] Đã test health check endpoint
- [ ] Đã lấy và lưu Railway URL
- [ ] Đã update Frontend với Railway URL
- [ ] Test toàn bộ API endpoints

---

## 🎯 BƯỚC TIẾP THEO

1. ✅ **Backend trên Railway** - XONG
2. ✅ **Backend trên Render** - XONG (có sẵn)
3. 🔜 **Deploy Frontend** lên Vercel/Netlify
4. 🔜 **Test End-to-End** toàn bộ hệ thống
5. 🔜 **Setup Custom Domain** (nếu có)
6. 🔜 **Monitoring & Optimization**

---

## 💡 TIPS & BEST PRACTICES

### 1. **Sử dụng Railway cho Development/Staging**
```
- Production: Render (free tier stable)
- Development: Railway (fast deployment, no sleep)
```

### 2. **Monitoring Logs**
- Thường xuyên check Logs để phát hiện lỗi sớm
- Railway có real-time logs rất tiện

### 3. **Environment Management**
- Dùng Railway cho nhiều môi trường:
  - `production` (branch main)
  - `staging` (branch develop)
  - `development` (branch backend)

### 4. **Backup Environment Variables**
- Lưu tất cả env variables vào file an toàn
- Hoặc dùng password manager

### 5. **Cost Optimization**
- Free tier: $5 credit/tháng
- Monitor usage trong **Settings** → **Usage**
- Estimate: ~$5-10/tháng cho 1 backend service

---

## 🆘 SUPPORT

### Nếu gặp vấn đề:

1. **Check Documentation:**
   - https://docs.railway.app

2. **Community:**
   - Discord: https://discord.gg/railway
   - Forum: https://help.railway.app

3. **Common Issues:**
   - https://docs.railway.app/troubleshoot/faq

---

## 🎊 KẾT LUẬN

Railway là platform tuyệt vời cho deploy Node.js backend:
- ✅ Deploy cực nhanh
- ✅ Tự động detect và config
- ✅ Không có cold start
- ✅ UI/UX hiện đại
- ✅ Metrics và logs đầy đủ

**Chúc bạn deploy thành công trên Railway! 🚂🚀**

---

**Prepared by:** GitHub Copilot  
**Date:** November 9, 2025  
**Version:** 1.0
