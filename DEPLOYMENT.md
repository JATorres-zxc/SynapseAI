# Deployment Guide for BlueChat MERN App

This guide will help you deploy your BlueChat application to production using Render (backend) and Vercel (frontend).

## Prerequisites

- GitHub repository with your code
- Render account (for backend)
- Vercel account (for frontend)
- MongoDB Atlas account (for database)

## Backend Deployment (Render)

### 1. Prepare Environment Variables

Create a `.env` file in your `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/bluechat

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRE=30d

# CORS Configuration (Update with your frontend URL)
CLIENT_URL=https://your-frontend-domain.vercel.app
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 2. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `bluechat-backend`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node 18` or higher

5. Add environment variables in Render dashboard:
   - Copy all variables from your `.env` file
   - Make sure to use your actual MongoDB URI and JWT secret

6. Deploy the service

### 3. Get Your Backend URL

After deployment, Render will provide you with a URL like:
`https://your-app-name.onrender.com`

## Frontend Deployment (Vercel)

### 1. Prepare Environment Variables

Create a `.env` file in your root directory with the following variables:

```env
# API Configuration
VITE_API_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com

# App Configuration
VITE_APP_NAME=BlueChat
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (root of your project)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add environment variables in Vercel dashboard:
   - Copy all variables from your `.env` file
   - Make sure to use your actual backend URL

6. Deploy the project

### 3. Get Your Frontend URL

After deployment, Vercel will provide you with a URL like:
`https://your-app-name.vercel.app`

## Update Environment Variables

After getting both URLs, update the environment variables:

### Backend (Render)
Update the CORS settings with your frontend URL:
```env
CLIENT_URL=https://your-frontend-domain.vercel.app
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### Frontend (Vercel)
Update the API URLs with your backend URL:
```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

## Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string
5. Update the `MONGODB_URI` in your backend environment variables

## File Uploads

The backend serves uploaded files from the `/uploads` directory. Make sure your Render service has persistent storage or consider using a cloud storage service like AWS S3 for production.

## SSL/HTTPS

Both Render and Vercel provide SSL certificates automatically, so your app will be served over HTTPS.

## Testing Your Deployment

1. Visit your frontend URL
2. Try to register/login
3. Test file uploads
4. Test real-time messaging
5. Check that all features work as expected

## Troubleshooting

### CORS Issues
- Make sure your backend `ALLOWED_ORIGINS` includes your frontend URL
- Check that the URLs are exactly correct (including protocol)

### Socket Connection Issues
- Verify that your `VITE_SOCKET_URL` is correct
- Check that your backend is running and accessible

### Database Connection Issues
- Verify your MongoDB URI is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure your database user has the correct permissions

### File Upload Issues
- Check that the upload directory exists and is writable
- Verify file size limits are appropriate

## Environment Variables Reference

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend.vercel.app
ALLOWED_ORIGINS=https://your-frontend.vercel.app
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SOCKET_URL=https://your-backend.onrender.com
VITE_APP_NAME=BlueChat
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

## Security Considerations

1. Use strong, unique JWT secrets
2. Keep environment variables secure
3. Use HTTPS in production
4. Implement rate limiting
5. Validate all user inputs
6. Use secure headers
7. Regular security updates

## Monitoring

- Set up logging for both frontend and backend
- Monitor API response times
- Set up error tracking (e.g., Sentry)
- Monitor database performance
- Set up uptime monitoring 