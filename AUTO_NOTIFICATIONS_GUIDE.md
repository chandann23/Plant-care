# 🔔 Automatic Notifications Guide

## How It Works

### In Production (Vercel) ✅
- Cron runs **automatically every hour**
- Checks for overdue tasks
- Sends notifications without any manual intervention
- **You don't need to do anything!**

### In Development (localhost) 🛠️
- Vercel cron doesn't run locally
- You need to run a development cron script
- This simulates production behavior

---

## 🚀 Setup for Development

### Option 1: Run Dev Cron Automatically (Recommended)

**Open TWO terminals:**

**Terminal 1 - Dev Server:**
```bash
bun dev
```

**Terminal 2 - Auto Cron:**
```bash
bun run dev:cron
```

Now the cron will run **automatically every 5 minutes** and check for due tasks!

### Option 2: Manual Testing
Just trigger manually when you want to test:
```bash
curl -X GET http://localhost:3000/api/cron/check-tasks \
  -H "Authorization: Bearer 2364dcfe0d4b2face937fe20a2c79d235795798d3b33431b6f28a399356db1b7"
```

---

## 🧪 Test the Auto Notifications

### Step 1: Start Both Servers
```bash
# Terminal 1
bun dev

# Terminal 2
bun run dev:cron
```

### Step 2: Enable Email Notifications
1. Go to http://localhost:3000/settings
2. Turn ON "Email Notifications"
3. Click "Save Preferences"

### Step 3: Create an Overdue Schedule
1. Go to a plant
2. Click "Add Care Schedule"
3. Set:
   - Task: Watering
   - Frequency: 1 day
   - Date: Today
   - **Time: 10 minutes ago** (e.g., if it's 10:00 PM, set 9:50 PM)
4. Click "Create Schedule"

### Step 4: Wait for Auto Notification
- The dev cron runs every 5 minutes
- Within 5 minutes, you'll see in Terminal 2:
  ```
  [10:05:00 PM] ✅ Cron executed successfully
    - Processed: 1 schedule(s)
    - Notifications sent: 1
  ```
- Check your email - you should have received a notification!

### Step 5: Verify Schedule Updated
- Go to Schedules page
- The "Next Due" date should be updated to tomorrow

---

## 📊 What You'll See

### Terminal 2 Output (Dev Cron):
```
🌱 Plant Care - Development Cron Runner
=====================================
Checking for due tasks every 5 minutes...
API URL: http://localhost:3000
Press Ctrl+C to stop

[9:45:00 PM] ✅ Cron executed successfully
  - Processed: 0 schedule(s)
  - Notifications sent: 0

[9:50:00 PM] ✅ Cron executed successfully
  - Processed: 1 schedule(s)
  - Notifications sent: 1

[9:55:00 PM] ✅ Cron executed successfully
  - Processed: 0 schedule(s)
  - Notifications sent: 0
```

---

## 🎯 Real-World Scenario

### User Creates Schedule for 10:00 PM

**10:00 PM** - Task becomes due
**10:05 PM** - Dev cron runs, finds due task, sends email
**User receives email** - "Time to water your plant!"
**Schedule updated** - Next due: Tomorrow at 10:00 PM

### Next Day at 10:00 PM
**10:00 PM** - Task becomes due again
**10:05 PM** - Dev cron runs, sends another email
**Cycle repeats** - Every day at the scheduled time

---

## 🔧 Customization

### Change Check Frequency

Edit `scripts/dev-cron.js`:

**Every 1 minute (for testing):**
```javascript
const CHECK_INTERVAL = 1 * 60 * 1000; // 1 minute
```

**Every 10 minutes:**
```javascript
const CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes
```

**Every hour (like production):**
```javascript
const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour
```

---

## 🚀 Production Deployment

When you deploy to Vercel:

1. ✅ Cron runs automatically (configured in `vercel.json`)
2. ✅ No need to run dev-cron script
3. ✅ Notifications sent every hour
4. ✅ Completely automatic!

**You don't need to do anything in production - it just works!**

---

## 💡 Summary

### Development:
- Run `bun dev` in one terminal
- Run `bun run dev:cron` in another terminal
- Cron checks every 5 minutes automatically
- Sends emails for overdue tasks

### Production:
- Deploy to Vercel
- Cron runs automatically every hour
- Sends emails for overdue tasks
- **Zero configuration needed!**

---

## 🎉 You're All Set!

Your app now works exactly like you wanted:
- ✅ User creates schedule for 10:00 PM
- ✅ If not completed by 10:00 PM, notification is sent
- ✅ Happens automatically without manual intervention
- ✅ Works in both development and production!
