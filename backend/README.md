# Backend API - Node.js + Express + MongoDB

## 🚀 Deploy on Render

This backend is ready to deploy on Render.com

### Environment Variables Required:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES` - JWT expiration time (e.g., 7d)
- `EMAIL_USER` - Gmail account for sending emails
- `EMAIL_PASSWORD` - Gmail app password
- `EMAIL_FROM_NAME` - Sender name for emails
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `FRONTEND_URL` - Frontend application URL
- `NODE_ENV` - Set to 'production'

### Build Command:
```
npm install
```

### Start Command:
```
npm start
```

## 🛠️ Local Development

1. Copy `.env.example` to `.env`
2. Fill in your environment variables
3. Run `npm install`
4. Run `npm run dev`

## 📚 API Documentation

See `API_DOCS.md` and `API_DOCS_PASSWORD_AVATAR.md` for detailed API documentation.
