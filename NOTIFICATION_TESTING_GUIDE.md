# 🔔 Notification Testing Guide

## Prerequisites
- Dev server running (`bun dev`)
- Logged in to the app
- At least one plant created

## Test 1: Email Notifications ✉️

### Step 1: Enable Email Notifications
1. Go to **Settings** page (http://localhost:3000/settings)
2. Toggle **Email Notifications** to ON
3. Click **Save Preferences**

### Step 2: Send Test Email
1. Click the **Send Test** button
2. Check your email inbox (chandanbasavaraj88@gmail.com)
3. You should receive an email with subject: "🌱 Time to watering Test Plant"

**Expected Result:**
- ✅ Toast notification: "Test notifications sent successfully"
- ✅ Email received in inbox within 1-2 minutes

**If it doesn't work:**
- Check browser console for errors (F12)
- Check terminal logs for error messages
- Verify RESEND_API_KEY is set in .env

---

## Test 2: Push Notifications 🔔

### Step 1: Enable Push Notifications
1. Go to **Settings** page
2. Toggle **Push Notifications** to ON
3. Browser will ask for notification permission
4. Click **Allow**

### Step 2: Verify FCM Token
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for a message like: "FCM Token: ..." (this means it worked)

### Step 3: Send Test Push
1. Click the **Send Test** button
2. You should see a browser notification appear

**Expected Result:**
- ✅ Browser asks for notification permission
- ✅ Toast: "Test notifications sent successfully"
- ✅ Browser notification appears with: "🌱 Plant Care Reminder - Time to watering Test Plant"

**If it doesn't work:**
- Check if notifications are blocked in browser settings
- Check browser console for Firebase errors
- Verify all Firebase env variables are set
- Try in Chrome/Edge (Firefox has different push notification support)

---

## Test 3: Real Schedule Notifications 📅

### Step 1: Create a Due Schedule
1. Go to **Plants** page
2. Click on a plant (or create a new one)
3. Click **Add Care Schedule**
4. Fill in:
   - **Task Type**: Watering
   - **Frequency**: 1 day
   - **Start Date**: Today
   - **Time**: Current time (or 5 minutes ago)
5. Click **Create Schedule**

### Step 2: Trigger the Cron Job Manually
Open a new terminal and run:
```bash
curl -X GET http://localhost:3000/api/cron/check-tasks \
  -H "Authorization: Bearer 2364dcfe0d4b2face937fe20a2c79d235795798d3b33431b6f28a399356db1b7"
```

### Step 3: Check for Notifications
- **Email**: Check your inbox
- **Push**: Should see browser notification

**Expected Result:**
```json
{
  "success": true,
  "processedCount": 1,
  "notificationsSent": 2,
  "timestamp": "2025-11-13T..."
}
```

---

## Test 4: Verify Notification Logs 📊

### Check in Database
Run this query in your database tool:
```sql
SELECT * FROM "NotificationLog" 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

**Expected Result:**
- Rows showing SENT status for email and push
- Timestamps matching when you triggered notifications

---

## Test 5: Check Schedule Updates ⏰

### Verify Next Due Date Updated
1. Go to **Schedules** page
2. Find the schedule you created
3. Check the "Next Due" date
4. It should be updated to tomorrow (current time + 1 day)

---

## Troubleshooting 🔧

### Email Not Received?
```bash
# Check if email preferences are enabled
# In browser console:
fetch('/api/notifications/preferences')
  .then(r => r.json())
  .then(console.log)
```

### Push Not Working?
```bash
# Check if FCM token is stored
# In browser console:
fetch('/api/notifications/preferences')
  .then(r => r.json())
  .then(data => console.log('FCM Token:', data.fcmToken))
```

### Check Browser Console
Press F12 and look for:
- ✅ "Service Worker registered"
- ✅ "FCM Token: ..."
- ❌ Any red error messages

### Check Terminal Logs
Look for:
- ✅ "Upload complete for userId: ..."
- ✅ "Email sent to ..."
- ❌ Any error messages

---

## Quick Test Checklist ✓

- [ ] Email notifications toggle works
- [ ] Push notifications toggle works
- [ ] Browser asks for notification permission
- [ ] "Send Test" button sends email
- [ ] "Send Test" button sends push notification
- [ ] Created schedule appears in schedules list
- [ ] Cron job finds due schedules
- [ ] Cron job sends notifications
- [ ] Cron job updates nextDueDate
- [ ] Notification logs are created in database

---

## Common Issues & Solutions

### Issue: "Firebase messaging not initialized"
**Solution:** 
- Check all NEXT_PUBLIC_FIREBASE_* env variables are set
- Restart dev server after adding env variables

### Issue: "Permission denied" for push notifications
**Solution:**
- Go to browser settings
- Find site settings for localhost:3000
- Reset notification permissions
- Refresh page and try again

### Issue: No email received
**Solution:**
- Check spam folder
- Verify RESEND_API_KEY is correct
- Check Resend dashboard for delivery status
- Remember: emails only go to verified address in testing

### Issue: Cron returns "Unauthorized"
**Solution:**
- Check CRON_SECRET matches in .env
- Make sure Authorization header is correct

---

## Testing in Different Browsers

### Chrome/Edge (Recommended)
- ✅ Full push notification support
- ✅ Service workers work well

### Firefox
- ⚠️ Push notifications work but may need different setup
- ✅ Email notifications work fine

### Safari
- ⚠️ Limited push notification support
- ✅ Email notifications work fine

---

## Next Steps

Once all tests pass:
1. Deploy to Vercel
2. Set all environment variables in Vercel dashboard
3. Test in production
4. Monitor Vercel logs for cron execution
5. Check notification logs in production database
