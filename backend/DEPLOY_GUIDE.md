# 🚀 HƯỚNG DẪN DEPLOY BACKEND LÊN RENDER

## Bước 1: Chuẩn bị và Push code lên GitHub

### 1.1. Kiểm tra Git (nếu chưa init)
```bash
cd d:\Phat_Trien_MNM\Buoi4_TH_Nhom\Group-4---Project
git status
```

### 1.2. Add và Commit code backend
```bash
# Add tất cả files trong thư mục backend
git add backend/

# Commit với message
git commit -m "Prepare backend for Render deployment"

# Push lên GitHub
git push origin backend
```

**LƯU Ý**: File `.env` đã được thêm vào `.gitignore` nên sẽ KHÔNG được push lên GitHub (bảo mật).

---

## Bước 2: Deploy trên Render.com

### 2.1. Đăng nhập Render
1. Truy cập: https://render.com
2. Đăng nhập bằng GitHub account
3. Cho phép Render truy cập vào repository của bạn

### 2.2. Tạo Web Service mới
1. Click **"New +"** ở góc trên bên phải
2. Chọn **"Web Service"**
3. Chọn repository: `Group-4---Project`
4. Click **"Connect"**

### 2.3. Cấu hình Web Service

#### Thông tin cơ bản:
- **Name**: `group-4-backend` (hoặc tên bạn muốn)
- **Region**: `Singapore` (hoặc gần nhất)
- **Branch**: `backend`
- **Root Directory**: `backend` ⚠️ **QUAN TRỌNG!**
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Instance Type:
- Chọn **"Free"** (cho testing)

---

## Bước 3: Thêm Environment Variables

Scroll xuống phần **"Environment Variables"** và thêm các biến sau:

### 3.1. Nhấn "Add Environment Variable" và thêm từng cặp:

| Key | Value | Ghi chú |
|-----|-------|---------|
| `MONGO_URI` | `mongodb+srv://levanhau2019cm_db_user:0946483539@vanhau.yrzkk4d.mongodb.net/groupDB?retryWrites=true&w=majority&appName=VanHau` | MongoDB connection |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` | Nên đổi sang chuỗi phức tạp hơn |
| `JWT_EXPIRES` | `7d` | Token expiration |
| `EMAIL_USER` | `hahaudem@gmail.com` | Gmail address |
| `EMAIL_PASSWORD` | `gqii sdik hrxd vkkp` | Gmail App Password |
| `EMAIL_FROM_NAME` | `Github_Team` | Sender name |
| `CLOUDINARY_CLOUD_NAME` | `dwk0vmnu5` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `925753278185974` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `h4iYBpF7TgAZGSxeuwheenPPKgQ` | Cloudinary API secret |
| `FRONTEND_URL` | `http://localhost:3000` | Sẽ update sau khi deploy frontend |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3001` | Port (tùy chọn, Render tự set) |

### 3.2. Lưu ý bảo mật ⚠️

**SAU KHI DEPLOY, NÊN:**
1. Đổi `JWT_SECRET` thành chuỗi ngẫu nhiên mạnh hơn
2. Tạo Gmail App Password mới riêng cho production
3. Cân nhắc tạo Cloudinary account riêng cho production

---

## Bước 4: Deploy

1. Nhấn **"Create Web Service"** ở cuối trang
2. Render sẽ bắt đầu build và deploy
3. Xem logs để theo dõi quá trình deploy

### Theo dõi Logs:
```
Building...
==> Downloading dependencies
==> Running 'npm install'
==> Build successful
==> Starting service with 'npm start'
🚀 Server running on port 10000
📝 Environment: production
MongoDB connected
```

---

## Bước 5: Kiểm tra kết quả

### 5.1. Lấy URL
Sau khi deploy thành công, Render sẽ cung cấp URL:
```
https://group-4-backend.onrender.com
```

### 5.2. Test API
Mở trình duyệt hoặc dùng Postman để test:

**Health Check:**
```
GET https://group-4-backend.onrender.com/
```

Response mong đợi:
```json
{
  "message": "Backend API is running",
  "status": "OK",
  "timestamp": "2025-11-09T..."
}
```

**Test Auth Endpoint:**
```
GET https://group-4-backend.onrender.com/auth
```

---

## Bước 6: Cập nhật Frontend

Sau khi có URL backend, cập nhật file `frontend/src/api.js`:

```javascript
const API_URL = 'https://group-4-backend.onrender.com';
```

---

## 🔧 Troubleshooting

### Lỗi thường gặp:

#### 1. **Build failed - Module not found**
- Kiểm tra `package.json` có đầy đủ dependencies
- Đảm bảo **Root Directory** = `backend`

#### 2. **MongoDB connection failed**
- Kiểm tra `MONGO_URI` có đúng không
- Whitelist IP `0.0.0.0/0` trên MongoDB Atlas (cho phép mọi IP)

#### 3. **Service keeps crashing**
- Xem logs để tìm lỗi cụ thể
- Kiểm tra tất cả Environment Variables đã được thêm

#### 4. **CORS errors**
- Cập nhật `FRONTEND_URL` sau khi deploy frontend
- Restart service trên Render

---

## 📌 Lưu ý quan trọng

### Free Tier Limitations:
- Service sẽ **sleep sau 15 phút không hoạt động**
- Request đầu tiên sau khi sleep sẽ **mất 30-60 giây để wake up**
- Để service luôn active, cần upgrade lên paid plan

### Auto-Deploy:
- Render tự động deploy lại khi có git push mới lên branch `backend`
- Có thể tắt auto-deploy trong settings nếu muốn

### Custom Domain (Optional):
- Có thể add custom domain trong Settings > Custom Domains
- Ví dụ: `api.yourdomain.com`

---

## ✅ Checklist Deploy

- [ ] Code đã được push lên GitHub
- [ ] File `.env` KHÔNG được push (đã có trong `.gitignore`)
- [ ] Đã tạo Web Service trên Render
- [ ] Root Directory = `backend`
- [ ] Build Command = `npm install`
- [ ] Start Command = `npm start`
- [ ] Đã thêm đầy đủ Environment Variables
- [ ] MongoDB Atlas đã whitelist IP `0.0.0.0/0`
- [ ] Deploy thành công
- [ ] Test health check endpoint
- [ ] Đã lưu URL backend
- [ ] Chuẩn bị deploy frontend với URL backend mới

---

## 🎯 Bước tiếp theo

1. ✅ Deploy backend xong
2. 🔜 Deploy frontend lên Vercel/Netlify
3. 🔜 Cập nhật `FRONTEND_URL` trên Render
4. 🔜 Test toàn bộ flow: Register → Login → Profile → Upload Avatar → Reset Password

**Chúc bạn deploy thành công! 🚀**
