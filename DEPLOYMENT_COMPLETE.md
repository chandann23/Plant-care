# Complete Deployment Guide

## Prerequisites

- Node.js 18+ or Bun installed
- PostgreSQL database (Vercel Postgres, Supabase, or Neon recommended)
- Vercel account
- Firebase project
- Resend account

## Step 1: Database Setup

### Option A: Vercel Postgres
1. Go to Vercel Dashboard → Storage → Create Database
2. Select Postgres
3. Copy the `DATABASE_URL` connection string

### Option B: Supabase
1. Create a new project at supabase.com
2. Go to Settings → Database
3. Copy the connection string (use "Connection pooling" for production)

### Option C: Neon
1. Create a new project at neon.tech
2. Copy the connection string

## Step 2: Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="your-postgres-connection-string"

# Auth (generate with: openssl rand -base64 32)
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-generated-secret"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Firebase (from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="your-vapid-key"

# Firebase Admin (from Firebase Console → Project Settings → Service Accounts)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"

# Resend (from resend.com/api-keys)
RESEND_API_KEY="re_your_api_key"

# Cron Secret (generate with: openssl rand -base64 32)
CRON_SECRET="your-cron-secret"
```

## Step 3: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Cloud Messaging:
   - Go to Project Settings → Cloud Messaging
   - Enable Cloud Messaging API
   - Copy the VAPID key
4. Generate service account:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file
   - Extract `project_id`, `client_email`, and `private_key`

## Step 4: Resend Setup

1. Go to [Resend](https://resend.com/)
2. Sign up and verify your email
3. Add and verify your domain (or use resend.dev for testing)
4. Create an API key
5. Copy the API key to `RESEND_API_KEY`

## Step 5: Vercel Blob Setup

1. Go to Vercel Dashboard → Storage → Create Database
2. Select Blob
3. Copy the `BLOB_READ_WRITE_TOKEN`

## Step 6: Database Migration

Run the following commands locally:

```bash
# Install dependencies
bun install

# Generate Prisma Client
bun prisma:generate

# Run migrations
bun prisma migrate deploy
```

## Step 7: Deploy to Vercel

### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... add all other environment variables

# Deploy to production
vercel --prod
```

### Option B: Deploy via GitHub

1. Push your code to GitHub
2. Go to Vercel Dashboard
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables in Vercel dashboard
6. Deploy

## Step 8: Configure Vercel Cron Job

The cron job is already configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-tasks",
      "schedule": "0 * * * *"
    }
  ]
}
```

This runs every hour. Make sure to set the `CRON_SECRET` environment variable in Vercel.

## Step 9: Verify Deployment

1. Visit your deployed URL
2. Sign up for a new account
3. Add a plant
4. Create a care schedule
5. Test notifications in Settings
6. Verify cron job runs (check Vercel logs)

## Step 10: Post-Deployment

### Monitor Logs
- Go to Vercel Dashboard → Your Project → Logs
- Monitor for errors

### Set up Alerts
- Configure Vercel alerts for errors
- Set up uptime monitoring (e.g., UptimeRobot)

### Performance Optimization
- Enable Vercel Analytics
- Monitor Core Web Vitals
- Optimize images if needed

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- For Supabase, use connection pooling URL

### Authentication Issues
- Verify `NEXTAUTH_URL` matches your domain
- Ensure `NEXTAUTH_SECRET` is set
- Check browser cookies are enabled

### Notification Issues
- Verify Firebase credentials are correct
- Check Resend API key is valid
- Verify domain is verified in Resend
- Check cron job logs in Vercel

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check for TypeScript errors
- Ensure Prisma client is generated

## Security Checklist

- [ ] All environment variables are set in Vercel (not in code)
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] `CRON_SECRET` is a strong random string
- [ ] Database credentials are secure
- [ ] Firebase private key is properly formatted
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is in place

## Maintenance

### Database Backups
- Set up automatic backups in your database provider
- Test restore process regularly

### Updates
```bash
# Update dependencies
bun update

# Run tests
bun test

# Deploy
vercel --prod
```

### Monitoring
- Check Vercel logs regularly
- Monitor database performance
- Track notification delivery rates
- Review error reports

## Cost Estimates

### Free Tier (Hobby)
- Vercel: Free for personal projects
- Vercel Postgres: 256 MB storage, 60 hours compute
- Vercel Blob: 500 MB storage
- Firebase: 10K messages/month
- Resend: 100 emails/day

### Paid Tier (Production)
- Vercel Pro: $20/month
- Database: $10-50/month depending on provider
- Firebase: Pay as you go
- Resend: $20/month for 50K emails

## Support

For issues:
1. Check Vercel logs
2. Review error messages
3. Check environment variables
4. Verify database connection
5. Test locally first

## Next Steps

After deployment:
1. Set up custom domain
2. Configure SSL certificate (automatic with Vercel)
3. Set up monitoring and alerts
4. Create user documentation
5. Plan for scaling if needed
