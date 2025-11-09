# 🚀 Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console.log statements in production code
- [ ] All TODO comments addressed or documented
- [ ] Code reviewed and tested locally
- [ ] Git repository is clean (no uncommitted changes)

### Environment Setup
- [ ] `.env.example` file is up to date
- [ ] All required environment variables documented
- [ ] Sensitive data removed from code
- [ ] API keys are not hardcoded

### Database
- [ ] Database schema is finalized
- [ ] Migrations are tested
- [ ] Indexes are in place
- [ ] Backup strategy planned

## Service Setup

### 1. Database (Choose One)

#### Vercel Postgres
- [ ] Create Vercel Postgres database
- [ ] Copy `DATABASE_URL` connection string
- [ ] Test connection locally

#### Supabase
- [ ] Create Supabase project
- [ ] Enable connection pooling
- [ ] Copy connection string
- [ ] Test connection locally

#### Neon
- [ ] Create Neon project
- [ ] Copy connection string
- [ ] Test connection locally

### 2. Vercel Blob Storage
- [ ] Create Vercel Blob storage
- [ ] Copy `BLOB_READ_WRITE_TOKEN`
- [ ] Test upload locally
- [ ] Configure CORS if needed

### 3. Firebase (Push Notifications)
- [ ] Create Firebase project
- [ ] Enable Cloud Messaging
- [ ] Generate VAPID key
- [ ] Download service account JSON
- [ ] Extract credentials:
  - [ ] `FIREBASE_PROJECT_ID`
  - [ ] `FIREBASE_CLIENT_EMAIL`
  - [ ] `FIREBASE_PRIVATE_KEY`
- [ ] Copy public config:
  - [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

### 4. Resend (Email Notifications)
- [ ] Create Resend account
- [ ] Verify email domain (or use resend.dev for testing)
- [ ] Create API key
- [ ] Copy `RESEND_API_KEY`
- [ ] Test email sending

### 5. Authentication
- [ ] Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- [ ] Set production `NEXTAUTH_URL`
- [ ] Generate `CRON_SECRET`: `openssl rand -base64 32`

## Vercel Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### 2. Import to Vercel
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "New Project"
- [ ] Import GitHub repository
- [ ] Select repository

### 3. Configure Project
- [ ] Set project name
- [ ] Select framework preset: Next.js
- [ ] Set root directory (if needed)
- [ ] Configure build settings (usually auto-detected)

### 4. Add Environment Variables

Copy and paste each variable from your local `.env`:

**Database**
- [ ] `DATABASE_URL`

**Authentication**
- [ ] `NEXTAUTH_URL` (use your Vercel domain)
- [ ] `NEXTAUTH_SECRET`

**Storage**
- [ ] `BLOB_READ_WRITE_TOKEN`

**Firebase (Public)**
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

**Firebase (Private)**
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `FIREBASE_PRIVATE_KEY` (keep the `\n` characters)

**Email**
- [ ] `RESEND_API_KEY`

**Cron**
- [ ] `CRON_SECRET`

### 5. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors

## Post-Deployment

### 1. Database Migration
```bash
# Run migrations in production
npx prisma migrate deploy
```

Or use Vercel CLI:
```bash
vercel env pull .env.production
npx prisma migrate deploy
```

### 2. Verify Deployment

#### Basic Functionality
- [ ] Visit production URL
- [ ] Sign up for new account
- [ ] Verify email works (if configured)
- [ ] Sign in with new account
- [ ] Add a plant
- [ ] Upload an image
- [ ] Create a care schedule
- [ ] View dashboard
- [ ] Check tasks page
- [ ] Test notification preferences

#### API Endpoints
- [ ] Test plant CRUD operations
- [ ] Test schedule CRUD operations
- [ ] Test task completion
- [ ] Test image upload
- [ ] Test authentication flow

#### Notifications
- [ ] Test email notification (if configured)
- [ ] Test push notification (if configured)
- [ ] Verify notification preferences save
- [ ] Check notification logs

#### Cron Job
- [ ] Verify cron job is configured in Vercel
- [ ] Check cron job logs after first run
- [ ] Verify tasks are checked hourly
- [ ] Verify notifications are sent

### 3. Performance Check
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Test on mobile device
- [ ] Test on different browsers
- [ ] Check Core Web Vitals

### 4. Security Check
- [ ] Verify HTTPS is enabled
- [ ] Check security headers
- [ ] Test authentication
- [ ] Verify rate limiting works
- [ ] Test authorization (can't access other users' data)

### 5. Monitoring Setup
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking
- [ ] Configure uptime monitoring
- [ ] Set up alerts for errors

## Domain Configuration (Optional)

### Custom Domain
- [ ] Purchase domain
- [ ] Add domain in Vercel
- [ ] Configure DNS records
- [ ] Wait for SSL certificate
- [ ] Update `NEXTAUTH_URL` to custom domain
- [ ] Test with custom domain

## Backup & Recovery

### Database Backups
- [ ] Enable automatic backups in database provider
- [ ] Test backup restoration
- [ ] Document backup schedule
- [ ] Store backup credentials securely

### Code Backups
- [ ] Ensure GitHub repository is backed up
- [ ] Tag release version
- [ ] Document deployment process

## Documentation

### Update Documentation
- [ ] Update README with production URL
- [ ] Document any production-specific setup
- [ ] Update API documentation
- [ ] Create user guide (if needed)

### Team Communication
- [ ] Notify team of deployment
- [ ] Share production URL
- [ ] Share admin credentials (if applicable)
- [ ] Document any known issues

## Rollback Plan

### If Something Goes Wrong
1. [ ] Check Vercel deployment logs
2. [ ] Check browser console for errors
3. [ ] Check database connection
4. [ ] Verify environment variables
5. [ ] Rollback to previous deployment if needed

### Rollback Steps
```bash
# Via Vercel Dashboard
# Go to Deployments → Select previous deployment → Promote to Production

# Via Vercel CLI
vercel rollback
```

## Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Check database performance monthly
- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Backup database regularly

### Updates
- [ ] Test updates in staging first
- [ ] Deploy during low-traffic hours
- [ ] Monitor after deployment
- [ ] Keep changelog updated

## Success Criteria

### Deployment is Successful When:
- [ ] Application loads without errors
- [ ] Users can sign up and sign in
- [ ] All CRUD operations work
- [ ] Images upload successfully
- [ ] Notifications are sent
- [ ] Cron job runs successfully
- [ ] Performance metrics are met
- [ ] No security vulnerabilities
- [ ] Mobile experience is good
- [ ] All pages are accessible

## Final Steps

- [ ] Announce launch to users
- [ ] Monitor for first 24 hours
- [ ] Gather initial feedback
- [ ] Address any critical issues
- [ ] Plan next iteration

---

## Quick Reference

### Useful Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Pull environment variables
vercel env pull

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

### Important URLs

- Vercel Dashboard: https://vercel.com/dashboard
- Firebase Console: https://console.firebase.google.com
- Resend Dashboard: https://resend.com/dashboard
- Database Dashboard: [Your database provider]

### Support Contacts

- Vercel Support: https://vercel.com/support
- Firebase Support: https://firebase.google.com/support
- Resend Support: https://resend.com/support

---

**Remember**: Always test in a staging environment before deploying to production!

Good luck with your deployment! 🚀
