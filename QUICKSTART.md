# 🚀 Quick Start Guide

Get your Plant Care App up and running in 10 minutes!

## Prerequisites

- [Bun](https://bun.sh/) or Node.js 18+ installed
- PostgreSQL database (local or cloud)

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd plant-care-app

# Install dependencies
bun install
```

## Step 2: Database Setup (3 minutes)

### Option A: Local PostgreSQL

```bash
# Install PostgreSQL if not already installed
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create database
createdb plantcare

# Set DATABASE_URL in .env
echo 'DATABASE_URL="postgresql://localhost:5432/plantcare"' > .env
```

### Option B: Cloud Database (Recommended)

Use one of these free options:
- **Vercel Postgres**: [vercel.com/storage](https://vercel.com/storage)
- **Supabase**: [supabase.com](https://supabase.com)
- **Neon**: [neon.tech](https://neon.tech)

Copy the connection string to your `.env` file.

## Step 3: Environment Variables (2 minutes)

Create `.env` file with minimal config:

```env
# Required
DATABASE_URL="your-database-url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Optional (for full features)
BLOB_READ_WRITE_TOKEN="get-from-vercel"
RESEND_API_KEY="get-from-resend.com"
CRON_SECRET="run: openssl rand -base64 32"

# Firebase (optional, for push notifications)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
# ... other Firebase vars
```

Generate secrets:
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate CRON_SECRET
openssl rand -base64 32
```

## Step 4: Initialize Database (1 minute)

```bash
# Generate Prisma Client
bun prisma:generate

# Run migrations
bun prisma:migrate

# (Optional) Seed with sample data
bun prisma db seed
```

## Step 5: Start Development Server (1 minute)

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Step 6: Create Your First Plant (1 minute)

1. Click "Sign Up" and create an account
2. Go to "Plants" → "Add Plant"
3. Fill in plant details and upload a photo
4. Click "Save Plant"

## Step 7: Create a Care Schedule

1. Go to "Schedules" → "Add Schedule"
2. Select your plant
3. Choose task type (Watering/Fertilizing)
4. Set frequency and time
5. Click "Save Schedule"

## 🎯 You're Done!

Your plant care app is now running locally. Here's what you can do next:

### Immediate Next Steps
- ✅ Add more plants
- ✅ Create care schedules
- ✅ View tasks on dashboard
- ✅ Complete tasks and add notes

### Enable Full Features

#### Email Notifications
1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Add to `.env`: `RESEND_API_KEY="re_..."`
4. Restart server

#### Image Uploads
1. Create Vercel Blob storage
2. Get token from Vercel dashboard
3. Add to `.env`: `BLOB_READ_WRITE_TOKEN="..."`
4. Restart server

#### Push Notifications
1. Create Firebase project
2. Enable Cloud Messaging
3. Add Firebase config to `.env`
4. Restart server

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
pg_isready

# Verify DATABASE_URL format
# Should be: postgresql://user:password@host:port/database
```

### Prisma Client Not Found
```bash
# Regenerate Prisma Client
bun prisma:generate
```

### Port Already in Use
```bash
# Use different port
PORT=3001 bun dev
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
bun install
bun dev
```

## 📚 Learn More

- [Full Documentation](./README.md)
- [Deployment Guide](./DEPLOYMENT_COMPLETE.md)
- [API Documentation](./API.md)

## 💡 Tips

1. **Use Prisma Studio** to view your database:
   ```bash
   bun prisma:studio
   ```

2. **Check logs** for debugging:
   - Browser console for frontend errors
   - Terminal for backend errors

3. **Test notifications** in Settings page before deploying

4. **Backup your database** regularly:
   ```bash
   pg_dump plantcare > backup.sql
   ```

## 🚀 Deploy to Production

When ready to deploy:

```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Deploy to Vercel
vercel
```

See [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md) for detailed instructions.

## 🆘 Need Help?

- Check [README.md](./README.md) for detailed documentation
- Open an issue on GitHub
- Check the troubleshooting section above

---

Happy planting! 🌱
