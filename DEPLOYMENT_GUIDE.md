# Deployment Guide

This guide will walk you through deploying the Plant Care Reminder app to production.

## Prerequisites

- GitHub account
- Vercel account
- Production database (Vercel Postgres, Supabase, or Neon)
- Resend account (for email notifications)
- Firebase project (for push notifications)

## Step 1: Set Up Production Database

### Option A: Vercel Postgres

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the `DATABASE_URL` connection string

### Option B: Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy the connection string (use "Connection pooling" for better performance)

### Option C: Neon

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string from the dashboard

## Step 2: Set Up Vercel Blob Storage

1. Go to your Vercel dashboard
2. Navigate to Storage → Create Store → Blob
3. Copy the `BLOB_READ_WRITE_TOKEN`

## Step 3: Set Up Resend for Email

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use the test domain for development)
3. Create an API key
4. Copy the `RESEND_API_KEY`

## Step 4: Set Up Firebase for Push Notifications

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Follow the setup wizard

### Enable Cloud Messaging

1. In your Firebase project, go to Project Settings
2. Navigate to Cloud Messaging tab
3. Generate a new Web Push certificate (VAPID key)
4. Copy the VAPID key

### Get Service Account Credentials

1. In Firebase Console, go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract these values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### Get Client Configuration

1. In Firebase Console, go to Project Settings → General
2. Scroll to "Your apps" section
3. Click "Add app" → Web
4. Register your app
5. Copy the configuration values:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

## Step 5: Generate Secrets

Generate secure secrets for authentication:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate CRON_SECRET
openssl rand -base64 32
```

## Step 6: Deploy to Vercel

### Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### Import Project in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `bun run build` (or leave default)
   - Output Directory: .next (default)

### Configure Environment Variables

In the Vercel project settings, add all environment variables:

#### Required Variables

```env
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-generated-secret
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
RESEND_API_KEY=your-resend-api-key
CRON_SECRET=your-generated-cron-secret
```

#### Firebase Variables (Optional)

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key-with-newlines
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-vapid-key
```

**Important**: For `FIREBASE_PRIVATE_KEY`, make sure to keep the newlines. In Vercel, paste the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`.

### Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

## Step 7: Run Database Migrations

After the first deployment, you need to run migrations:

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migrations
vercel env pull .env.production
bun prisma migrate deploy
```

### Option B: Using GitHub Actions

Create `.github/workflows/migrate.yml`:

```yaml
name: Database Migration

on:
  workflow_dispatch:

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

Then run the workflow manually from GitHub Actions tab.

### Option C: Manual Migration

1. Connect to your production database using a client (e.g., pgAdmin, TablePlus)
2. Run the SQL from your migration files in `prisma/migrations/`

## Step 8: Update Firebase Service Worker

After deployment, update the Firebase configuration in `public/firebase-messaging-sw.js`:

1. Replace the placeholder values with your actual Firebase config
2. Commit and push the changes
3. Vercel will automatically redeploy

## Step 9: Configure Custom Domain (Optional)

1. In Vercel project settings, go to Domains
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable to your custom domain
5. Redeploy

## Step 10: Test the Deployment

### Test Authentication

1. Visit your deployed app
2. Sign up for a new account
3. Verify you can log in

### Test Plant Management

1. Add a new plant with a photo
2. Verify the image uploads correctly
3. Edit and delete the plant

### Test Care Schedules

1. Create a care schedule
2. Verify it appears in the tasks list
3. Complete a task

### Test Notifications

1. Go to Settings
2. Enable email notifications
3. Click "Send Test"
4. Check your email

### Test Cron Job

The cron job runs automatically every hour. To test it manually:

```bash
curl -X GET https://your-domain.vercel.app/api/cron/check-tasks \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Monitoring and Debugging

### View Logs

1. Go to Vercel dashboard
2. Navigate to your project → Deployments
3. Click on a deployment → View Function Logs

### Monitor Cron Jobs

1. In Vercel dashboard, go to your project
2. Navigate to Cron Jobs tab
3. View execution history and logs

### Database Monitoring

- **Vercel Postgres**: Use the Vercel dashboard
- **Supabase**: Use the Supabase dashboard
- **Neon**: Use the Neon dashboard

### Error Tracking (Optional)

Consider integrating error tracking:
- [Sentry](https://sentry.io)
- [LogRocket](https://logrocket.com)
- [Datadog](https://www.datadoghq.com)

## Troubleshooting

### Build Fails

- Check build logs in Vercel
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `bun run build` locally

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- For Supabase, use connection pooling URL

### Images Not Uploading

- Verify `BLOB_READ_WRITE_TOKEN` is correct
- Check Vercel Blob storage quota
- Ensure file size is under 5MB

### Emails Not Sending

- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for delivery status
- Verify sender email is from verified domain

### Push Notifications Not Working

- Verify all Firebase environment variables are correct
- Check Firebase Console for errors
- Ensure service worker is registered correctly
- Test in different browsers (Chrome, Firefox, Edge)

### Cron Job Not Running

- Verify `CRON_SECRET` is set correctly
- Check cron job logs in Vercel dashboard
- Ensure `vercel.json` is in the repository root
- Cron jobs only run on production deployments

## Security Checklist

- [ ] All environment variables are set
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] `CRON_SECRET` is strong and unique
- [ ] Database credentials are secure
- [ ] Firebase private key is properly formatted
- [ ] Custom domain has HTTPS enabled
- [ ] Rate limiting is working
- [ ] CORS is properly configured

## Performance Optimization

### Enable Vercel Analytics

1. Go to Vercel project settings
2. Navigate to Analytics
3. Enable Web Analytics

### Configure Caching

The app already includes:
- React Query caching
- Next.js automatic caching
- Image optimization

### Database Optimization

- Ensure indexes are created (already in schema)
- Monitor slow queries
- Consider connection pooling for high traffic

## Backup Strategy

### Database Backups

- **Vercel Postgres**: Automatic backups included
- **Supabase**: Automatic backups included
- **Neon**: Automatic backups included

### Manual Backup

```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Import database
psql $DATABASE_URL < backup.sql
```

## Scaling Considerations

### Horizontal Scaling

Vercel automatically scales your Next.js app based on traffic.

### Database Scaling

- Monitor database performance
- Upgrade plan if needed
- Consider read replicas for high traffic

### File Storage Scaling

- Vercel Blob scales automatically
- Monitor storage usage and costs

## Cost Estimation

### Vercel

- Hobby: Free (includes 100GB bandwidth)
- Pro: $20/month (includes 1TB bandwidth)

### Database

- Vercel Postgres: $0.25/GB/month
- Supabase: Free tier available, Pro $25/month
- Neon: Free tier available, Pro $19/month

### Resend

- Free: 100 emails/day
- Pro: $20/month (50,000 emails)

### Firebase

- Free: 10GB storage, 1GB/day bandwidth
- Blaze: Pay as you go

## Support

For deployment issues:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Join Vercel Discord: [vercel.com/discord](https://vercel.com/discord)
- Open an issue on GitHub

---

Congratulations! Your Plant Care Reminder app is now deployed and ready to use! 🌱
