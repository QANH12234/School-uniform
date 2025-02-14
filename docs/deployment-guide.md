# Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account
- Node.js and npm installed

## Step 1: Prepare MongoDB Database
1. Create MongoDB Atlas account
2. Create new cluster (free tier is fine)
3. Get connection string
4. Replace `MONGODB_URI` in backend/.env

## Step 2: Backend Deployment (Railway.app)
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Create new project
4. Select the backend directory
5. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_app_password
   ADMIN_EMAIL=your_admin_email
   ```
6. Deploy

## Step 3: Frontend Deployment (Vercel)
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set environment variables:
   ```
   VITE_API_URL=your_railway_backend_url
   ```
5. Deploy

## Step 4: Admin Panel Deployment (Vercel)
1. Create new project in Vercel
2. Configure build settings:
   - Root Directory: `admin`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables:
   ```
   VITE_API_URL=your_railway_backend_url
   ```
4. Deploy

## Important Notes
- Update all API endpoints in frontend/src/services/api.js and admin/src/services/api.js to use the deployed backend URL
- Enable CORS in backend for your frontend domains
- Set up proper security headers
- Configure custom domains if needed

## Optimization Tips
- Enable caching headers
- Use CDN for images
- Enable gzip compression
- Set up proper SSL certificates (automatic with Vercel/Railway) 