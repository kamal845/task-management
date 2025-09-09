# Deployment Guide

This guide will help you deploy the Task Management App to production using Vercel and MongoDB Atlas.

## 🚀 Quick Deployment

### Prerequisites
- GitHub account
- Vercel account
- MongoDB Atlas account

## 📋 Step-by-Step Deployment

### 1. Prepare Your Repository

1. Push your code to GitHub
2. Ensure all environment variables are documented
3. Test the application locally

### 2. MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region
   - Name your cluster (e.g., "taskmanagement")

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password
   - Grant "Read and write to any database" privileges

4. **Whitelist IP Addresses**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Add your current IP
   - For production: Add `0.0.0.0/0` (allows all IPs)

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name

### 3. Deploy Backend to Vercel

1. **Create Vercel Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Backend Deployment**
   - Set **Root Directory**: `server`
   - Set **Build Command**: `npm install`
   - Set **Output Directory**: Leave empty
   - Set **Install Command**: `npm install`

3. **Add Environment Variables**
   ```

   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
   JWT_EXPIRE=7d
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the deployment URL (e.g., `https://your-backend.vercel.app`)

### 4. Deploy Frontend to Vercel

1. **Create Another Vercel Project**
   - Click "New Project" again
   - Import the same GitHub repository

2. **Configure Frontend Deployment**
   - Set **Root Directory**: `client`
   - Set **Build Command**: `npm run build`
   - Set **Output Directory**: `build`
   - Set **Install Command**: `npm install`

3. **Add Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the frontend URL (e.g., `https://your-frontend.vercel.app`)

### 5. Update Backend Environment Variables

1. Go back to your backend Vercel project
2. Update the `CLIENT_URL` environment variable with your frontend URL
3. Redeploy the backend

## 🔧 Environment Variables Reference

### Backend (.env)
```env
# Database

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRE=7d

# Server
PORT=4000
NODE_ENV=production

# CORS
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

## 🧪 Testing Your Deployment

1. **Test Backend**
   - Visit `https://your-backend.vercel.app/api/health`
   - Should return a JSON response with server status

2. **Test Frontend**
   - Visit your frontend URL
   - Try registering a new account
   - Create a task
   - Test all functionality

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_URL` in backend matches your frontend URL exactly
   - Check for trailing slashes

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist includes `0.0.0.0/0`
   - Ensure database user has correct permissions

3. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Check for TypeScript errors

4. **Environment Variables Not Working**
   - Redeploy after adding environment variables
   - Check variable names match exactly
   - Ensure no spaces around `=` sign

### Debugging Steps

1. **Check Vercel Logs**
   - Go to your project dashboard
   - Click on "Functions" tab
   - Check function logs for errors

2. **Test API Endpoints**
   - Use Postman or curl to test endpoints
   - Check response headers and status codes

3. **Database Connection Test**
   - Use MongoDB Compass to test connection
   - Verify database and collections exist

## 📊 Monitoring and Analytics

### Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and usage

### MongoDB Atlas Monitoring
- Use Atlas monitoring dashboard
- Set up alerts for database performance

## 🔄 Continuous Deployment

### Automatic Deployments
- Vercel automatically deploys on git push
- Set up branch protection rules
- Use preview deployments for testing

### Environment Management
- Use different Vercel projects for staging/production
- Set up environment-specific variables
- Use Vercel CLI for local development

## 🛡️ Security Considerations

### Production Security
- Use strong JWT secrets
- Enable HTTPS (automatic with Vercel)
- Regularly update dependencies
- Monitor for security vulnerabilities

### Database Security
- Use strong database passwords
- Regularly rotate credentials
- Monitor database access logs
- Enable MongoDB Atlas security features

## 📈 Performance Optimization

### Frontend Optimization
- Enable Vercel's automatic optimizations
- Use CDN for static assets
- Implement proper caching strategies

### Backend Optimization
- Use connection pooling
- Implement proper indexing
- Monitor API response times
- Use Vercel's edge functions if needed

## 🆘 Support

If you encounter issues:

1. Check Vercel documentation
2. Review MongoDB Atlas documentation
3. Check application logs
4. Test locally first
5. Contact support if needed

---

**Note**: This deployment guide assumes you're using the free tiers of both Vercel and MongoDB Atlas. For production applications, consider upgrading to paid plans for better performance and support.
