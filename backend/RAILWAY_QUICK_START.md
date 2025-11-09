# 🚂 RAILWAY DEPLOY - QUICK START

## ⚡ TÓM TẮT 5 BƯỚC

### 1️⃣ PUSH CODE
```powershell
cd d:\Phat_Trien_MNM\Buoi4_TH_Nhom\Group-4---Project
git add .
git commit -m "Add Railway configuration"
git push origin backend
```

### 2️⃣ TẠO PROJECT RAILWAY
1. Vào: https://railway.app
2. Login with GitHub
3. Click: **New Project** → **Deploy from GitHub repo**
4. Chọn: **Group-4---Project**
5. Root Directory: `backend`
6. Branch: `backend`

### 3️⃣ THÊM ENVIRONMENT VARIABLES

Click **Variables** và thêm 11 biến:

```env
MONGO_URI=mongodb+srv://levanhau2019cm_db_user:0946483539@vanhau.yrzkk4d.mongodb.net/groupDB?retryWrites=true&w=majority&appName=VanHau

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

JWT_EXPIRES=7d

EMAIL_USER=hahaudem@gmail.com

EMAIL_PASSWORD=gqii sdik hrxd vkkp

EMAIL_FROM_NAME=Github_Team

CLOUDINARY_CLOUD_NAME=dwk0vmnu5

CLOUDINARY_API_KEY=925753278185974

CLOUDINARY_API_SECRET=h4iYBpF7TgAZGSxeuwheenPPKgQ

FRONTEND_URL=http://localhost:3000

NODE_ENV=production
```

### 4️⃣ GENERATE DOMAIN
1. Vào **Settings** → **Networking**
2. Click: **Generate Domain**
3. Lấy URL: `https://xxxx.up.railway.app`

### 5️⃣ TEST API
```
GET https://your-backend.up.railway.app/
```

Response:
```json
{
  "message": "Backend API is running",
  "status": "OK"
}
```

---

## 🎯 RAILWAY URL

Sau khi deploy xong, Railway sẽ cung cấp URL:
```
https://group-4-backend.up.railway.app
```

---

## ✅ CHECKLIST

- [ ] Push code lên GitHub
- [ ] Tạo project trên Railway
- [ ] Chọn repo và set Root Directory = `backend`
- [ ] Thêm 11 Environment Variables
- [ ] Generate Domain
- [ ] Deploy thành công
- [ ] Test API endpoint

---

## 📚 DOCS CHI TIẾT

Xem file `RAILWAY_DEPLOY_GUIDE.md` để biết hướng dẫn chi tiết, troubleshooting và best practices.

---

**Chúc deploy thành công! 🚀**
