# 🔧 FIX NETWORK ERROR & CORS - VERCEL FRONTEND

## ❌ LỖI:
```
Network Error
Access to XMLHttpRequest at 'https://group-4-backend.onrender.com/auth/login' 
from origin 'https://group-4-project-beige.vercel.app' 
has been blocked by CORS policy
```

## 🔍 NGUYÊN NHÂN:
1. Backend chưa cho phép domain Vercel trong CORS
2. Frontend đang gọi API localhost thay vì production URL

---

## ✅ ĐÃ SỬA:

### 1. **Backend - Cập nhật CORS** ✅
File: `backend/server.js`
- Thêm domain Vercel vào `allowedOrigins`
- Tạm thời cho phép tất cả origins (có log để debug)

### 2. **Frontend - Cập nhật API URL** ✅
File: `frontend/.env`
- Đổi từ: `REACT_APP_API=http://localhost:3001`
- Thành: `REACT_APP_API_URL=https://group-4-backend.onrender.com`

### 3. **Tạo các file env** ✅
- `.env.example` - Template cho development
- `.env.production` - Production config
- Cập nhật `.gitignore` để không push `.env`

---

## 🚀 BƯỚC TIẾP THEO:

### **Bước 1: Push Backend Changes**
```powershell
cd d:\Phat_Trien_MNM\Buoi4_TH_Nhom\Group-4---Project
git add backend/server.js
git commit -m "Fix CORS: Allow Vercel domain"
git push origin backend
```

⏱️ **Đợi Render/Railway tự động deploy lại** (2-3 phút)

---

### **Bước 2: Cập nhật Environment Variable trên Vercel**

#### Cách 1: Qua Vercel Dashboard (KHUYẾN NGHỊ)
1. Vào: https://vercel.com/dashboard
2. Chọn project: **group-4-project-beige**
3. Click: **Settings** → **Environment Variables**
4. Add new variable:
   ```
   Name: REACT_APP_API_URL
   Value: https://group-4-backend.onrender.com
   Environment: Production, Preview, Development (check all)
   ```
5. Click: **Save**
6. Vào tab **Deployments**
7. Click **"..."** ở deployment mới nhất → **Redeploy**

#### Cách 2: Push Code và Redeploy
```powershell
# Push frontend changes
git add frontend/.env.production frontend/.env.example frontend/.gitignore
git commit -m "Fix: Update API URL to production backend"
git push origin backend

# Vercel sẽ tự động rebuild và deploy
```

⚠️ **LƯU Ý:** Nếu dùng cách 2, vẫn phải add Environment Variable trên Vercel Dashboard!

---

### **Bước 3: Clear Cache và Test**

1. **Clear browser cache:** Ctrl + Shift + Delete
2. **Hard refresh:** Ctrl + F5
3. **Test login:** https://group-4-project-beige.vercel.app/

---

## 🧪 KIỂM TRA:

### Test 1: Health Check Backend
```bash
curl https://group-4-backend.onrender.com/
```
✅ Response:
```json
{
  "message": "Backend API is running",
  "status": "OK"
}
```

### Test 2: CORS Header
```bash
curl -H "Origin: https://group-4-project-beige.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://group-4-backend.onrender.com/auth/login
```
✅ Response headers should include:
```
Access-Control-Allow-Origin: https://group-4-project-beige.vercel.app
Access-Control-Allow-Credentials: true
```

### Test 3: Frontend Login
1. Mở: https://group-4-project-beige.vercel.app/
2. Mở Console (F12)
3. Thử login
4. ✅ Không còn "Network Error"
5. ✅ Request đến `https://group-4-backend.onrender.com/auth/login`

---

## 🔧 NẾU VẪN LỖI:

### Lỗi 1: "Network Error" vẫn còn
**Giải pháp:**
1. Check Vercel Environment Variables đã add chưa
2. Rebuild deployment trên Vercel
3. Clear browser cache + hard refresh
4. Check Console xem API URL là gì:
   ```javascript
   console.log(process.env.REACT_APP_API_URL)
   ```

### Lỗi 2: CORS vẫn bị block
**Giải pháp:**
1. Check backend logs trên Render/Railway
2. Tìm dòng: `❌ CORS blocked origin: ...`
3. Thêm origin đó vào `allowedOrigins` trong `server.js`
4. Push và redeploy backend

### Lỗi 3: Backend không response
**Giải pháp:**
1. Check backend có đang chạy không:
   - Render: https://dashboard.render.com
   - Railway: https://railway.app
2. Check logs để tìm lỗi
3. Service có thể đang sleep (Render free tier) → đợi 30-60s

---

## 📌 CHECKLIST:

- [ ] Backend đã update CORS cho Vercel domain
- [ ] Backend đã push và deploy lại
- [ ] Frontend `.env.production` có đúng API URL
- [ ] Vercel Environment Variables đã add `REACT_APP_API_URL`
- [ ] Vercel đã redeploy
- [ ] Clear browser cache
- [ ] Test login thành công
- [ ] Không còn CORS error
- [ ] Không còn Network Error

---

## 🎯 KẾT QUẢ MONG ĐỢI:

**Trước:**
```
❌ Network Error
❌ CORS blocked
❌ Cannot connect to localhost:3001
```

**Sau:**
```
✅ Login thành công
✅ API calls work
✅ Data được load từ backend production
```

---

## 💡 BEST PRACTICES:

### 1. Environment Variables
**Development (.env.local):**
```
REACT_APP_API_URL=http://localhost:3001
```

**Production (Vercel Dashboard):**
```
REACT_APP_API_URL=https://group-4-backend.onrender.com
```

### 2. CORS Configuration
**Backend cho phép multiple domains:**
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://group-4-project-beige.vercel.app',
  'https://group-4-project-*.vercel.app', // All preview deployments
  process.env.FRONTEND_URL
];
```

### 3. API Base URL
**Dùng environment variable:**
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

---

**Chúc bạn fix lỗi thành công! 🚀**
