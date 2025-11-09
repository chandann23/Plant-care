# 🚀 Deployment Guide

This guide will help you deploy the Plant Care Reminder App to production.

## Prerequisites

- Vercel account
- PostgreSQL database (Vercel Postgres, Supabase, or Neon recommended)
- Vercel Blob storage account
- Resend account (for email notifications)
- Firebase project (for push notifications)

## Step 1: Database Setup

### Option A: Vercel Postgres

1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the connection string

### Option B: Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string (use "Connection pooling" for better performance)

### Option C: Neon

1. Create a new project at [neon.tech](https://neon.tech)
2. Copy the connection string

## Step 2: Vercel Blob Storage

1. Go to your Vercel dashboard
2. Navigate to Storage
3. Create a new Blob store
4. Copy the `BLOB_READ_WRITE_TOKEN`

## Step 3: Email Service (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use their test domain)
3. Create an API key
4. Copy the `RESEND_API_KEY`

## Step 4: Push Notifications (Firebase)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Cloud Messaging
4. Go to Project Settings > Service Accounts
5. Generate a new private key
6. Copy the following values:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
7. Go to Project Settings > General
8. Add a web app and copy:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
9. Go to Cloud Messaging and copy:
   - `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

## Step 5: Deploy to Vercel

### Via GitHub (Recommended)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables (see below)
6. Click "Deploy"

### Via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and add environment variables

## Step 6: Environment Variables

Add these environment variables in your Vercel project settings:

### Required Variables

```env
# Database
DATABASE_URL="your-postgres-connection-string"

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Cron Job
CRON_SECRET="generate-with-openssl-rand-base64-32"
```

### Optional (for notifications)

```env
# Resend Email
RESEND_API_KEY="your-resend-api-key"

# Firebase (Server)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-client-email"
FIREBASE_PRIVATE_KEY="your-private-key"

# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="your-vapid-key"
```

## Step 7: Run Database Migrations

After deployment, run migrations:

```bash
# Using Vercel CLI
vercel env pull .env.production
bunx prisma migrate deploy

# Or connect to your production database locally
DATABASE_URL="your-production-url" bunx prisma migrate deploy
```

## Step 8: Configure Cron Job

The cron job is automatically configured via `vercel.json`. Verify it's running:

1. Go to your Vercel project
2. Navigate to Settings > Cron Jobs
3. You should see `/api/cron/check-tasks` scheduled to run every hour

## Step 9: Test Your Deployment

1. Visit your deployed URL
2. Create a test account
3. Add a test plant
4. Create a care schedule
5. Test task completion
6. Configure notification preferences
7. Send a test notification

## Monitoring

### Vercel Analytics

Enable Vercel Analytics for performance monitoring:
1. Go to your project settings
2. Enable Analytics
3. View metrics in the Analytics tab

### Error Tracking

Consider adding error tracking:
- [Sentry](https://sentry.io)
- [LogRocket](https://logrocket.com)
- [Datadog](https://www.datadoghq.com)

### Database Monitoring

Monitor your database:
- Check connection pool usage
- Monitor query performance
- Set up alerts for slow queries

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check the build logs in Vercel
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript types are correct
4. Run `bun build` locally to test

### Database Connection Issues

If database connection fails:
1. Verify `DATABASE_URL` is correct
2. Check if your database allows connections from Vercel IPs
3. Ensure connection pooling is enabled
4. Try using a connection pooler (PgBouncer)

### Cron Job Not Running

If cron job doesn't run:
1. Verify `vercel.json` is in the root directory
2. Check `CRON_SECRET` is set correctly
3. View cron logs in Vercel dashboard
4. Test the endpoint manually with the correct auth header

### Image Upload Issues

If image uploads fail:
1. Verify `BLOB_READ_WRITE_TOKEN` is correct
2. Check Vercel Blob storage limits
3. Ensure file size is under 5MB
4. Check browser console for errors

## Performance Optimization

### Database

1. Add indexes to frequently queried fields (already done in schema)
2. Use connection pooling
3. Enable query caching
4. Monitor slow queries

### Images

1. Images are automatically optimized by Next.js
2. Consider using WebP format
3. Implement lazy loading (already done)
4. Use appropriate image sizes

### Caching

1. Configure CDN caching headers
2. Use React Query caching (already configured)
3. Enable Vercel Edge Caching
4. Consider Redis for session storage

## Security Checklist

- ✅ Environment variables are secure
- ✅ Database credentials are not exposed
- ✅ API routes are protected with authentication
- ✅ Rate limiting is enabled
- ✅ Input validation is in place
- ✅ HTTPS is enforced
- ✅ CORS is configured properly
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (React)

## Backup Strategy

### Database Backups

1. Enable automatic backups in your database provider
2. Set up daily backups
3. Test restore procedures
4. Store backups in multiple locations

### Code Backups

1. Use Git for version control
2. Push to GitHub regularly
3. Tag releases
4. Keep production branch protected

## Scaling Considerations

### Horizontal Scaling

- Vercel automatically scales your Next.js app
- Consider database read replicas for high traffic
- Use connection pooling for database connections

### Vertical Scaling

- Upgrade database plan as needed
- Monitor memory and CPU usage
- Optimize slow queries

## Cost Optimization

### Vercel

- Free tier includes:
  - 100GB bandwidth
  - 6,000 build minutes
  - Unlimited deployments
- Pro plan: $20/month per user

### Database

- Start with smallest plan
- Scale as needed
- Monitor usage regularly

### Blob Storage

- Pay per GB stored and transferred
- Implement cleanup for old images
- Compress images before upload

## Support

For deployment issues:
- Check Vercel documentation
- Visit Vercel community forums
- Contact Vercel support (Pro plan)

---

🎉 Congratulations! Your Plant Care Reminder App is now live!
