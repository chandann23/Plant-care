# UploadThing Setup Guide

## Quick Setup (5 minutes)

### 1. Create UploadThing Account

1. Go to [uploadthing.com](https://uploadthing.com/)
2. Click "Sign In" and sign in with GitHub
3. Create a new app

### 2. Get Your API Keys

1. After creating your app, you'll see your dashboard
2. Click on "API Keys" in the sidebar
3. Copy your credentials:
   - **Secret Key** (starts with `sk_live_...`)
   - **App ID** (your app identifier)

### 3. Add to .env File

Update your `.env` file with the credentials:

```env
UPLOADTHING_SECRET="sk_live_your_secret_key_here"
UPLOADTHING_APP_ID="your_app_id_here"
```

### 4. Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
bun dev
```

### 5. Test Image Upload

1. Go to http://localhost:3000
2. Sign in or create an account
3. Go to "Add Plant"
4. Try uploading an image
5. It should upload to UploadThing!

## Features

✅ **Free Tier**: 2GB storage, 2GB bandwidth/month  
✅ **Fast**: CDN-backed uploads  
✅ **Easy**: No complex configuration  
✅ **Secure**: Built-in authentication  
✅ **Automatic**: Image optimization  

## Troubleshooting

### "Unauthorized" Error
- Make sure you're signed in
- Check that UPLOADTHING_SECRET is correct

### "Upload Failed" Error
- Check file size (max 4MB)
- Check file type (images only)
- Verify API keys are set correctly

### Images Not Loading
- Check next.config.ts has uploadthing domains
- Verify the image URL is correct
- Check browser console for errors

## Free Tier Limits

- **Storage**: 2GB
- **Bandwidth**: 2GB/month
- **File Size**: Up to 16MB per file (we limit to 4MB)
- **Files**: Unlimited

Perfect for development and small projects!

## Upgrade Options

If you need more:
- **Pro**: $20/month - 100GB storage, 100GB bandwidth
- **Enterprise**: Custom pricing

## Documentation

- [UploadThing Docs](https://docs.uploadthing.com/)
- [Next.js Integration](https://docs.uploadthing.com/getting-started/appdir)
- [API Reference](https://docs.uploadthing.com/api-reference)

---

**That's it!** Your image uploads now use UploadThing instead of Vercel Blob. 🎉
