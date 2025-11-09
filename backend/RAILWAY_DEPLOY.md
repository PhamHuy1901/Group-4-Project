# 🚂 Deploy Backend trên Railway

Backend API đã được deploy trên Railway.

## 🌐 Production URL
```
https://group-4-backend.up.railway.app
```

## 🛠️ Environment Variables

Railway đã được cấu hình với các biến môi trường:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRES` - JWT expiration time
- `EMAIL_USER` - Gmail for sending emails
- `EMAIL_PASSWORD` - Gmail app password
- `EMAIL_FROM_NAME` - Email sender name
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `FRONTEND_URL` - Frontend URL
- `NODE_ENV` - production
- `PORT` - Auto-assigned by Railway

## 🔄 Auto Deploy

Railway tự động deploy khi có push mới lên branch `backend` của GitHub repository.

## 📚 API Endpoints

- `GET /` - Health check
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /profile` - Get user profile (requires auth)
- `PUT /profile` - Update profile (requires auth)
- `POST /upload` - Upload avatar (requires auth)
- `POST /password/forgot` - Forgot password
- `POST /password/reset/:token` - Reset password
- `GET /users` - Get all users (admin only)

## 🏗️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Email**: Nodemailer (Gmail)
- **Authentication**: JWT
