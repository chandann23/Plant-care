# 🧪 Test Real Notification Flow

## Step-by-Step Guide

### Step 1: Enable Email Notifications
1. Go to http://localhost:3000/settings
2. Toggle **Email Notifications** to ON
3. Click **Save Preferences**

### Step 2: Create a Plant (if you don't have one)
1. Go to http://localhost:3000/plants
2. Click **Add Plant**
3. Fill in:
   - Name: "Test Plant"
   - Species: "Monstera" (or anything)
4. Click **Create Plant**

### Step 3: Create a Schedule Due NOW
1. Click on your plant to view details
2. Click **Add Care Schedule**
3. Fill in:
   - **Task Type**: Watering
   - **Frequency**: 1 day
   - **Start Date**: Today's date
   - **Time**: **IMPORTANT** - Set to 5 minutes AGO
     - Example: If it's 9:45 PM now, set time to 9:40 PM
   - **Notes**: "Test notification"
4. Click **Create Schedule**

### Step 4: Verify Schedule is Due
The schedule should now be "overdue" because the time is in the past.

### Step 5: Trigger the Cron Job Manually
Open a new terminal and run:

```bash
curl -X GET http://localhost:3000/api/cron/check-tasks \
  -H "Authorization: Bearer 2364dcfe0d4b2face937fe20a2c79d235795798d3b33431b6f28a399356db1b7"
```

### Step 6: Check the Response
You should see something like:
```json
{
  "success": true,
  "processedCount": 1,
  "notificationsSent": 1,
  "timestamp": "2025-11-13T..."
}
```

### Step 7: Check Your Email
- Open your email inbox (chandanbasavaraj88@gmail.com)
- You should have received an email with:
  - Subject: "🌱 Time to watering Test Plant"
  - Body: Details about the task

### Step 8: Verify Schedule Updated
1. Go back to http://localhost:3000/schedules
2. Find your schedule
3. The "Next Due" date should now be **tomorrow** at the same time

---

## 🎯 Expected Results

✅ Cron response shows 1 schedule processed
✅ Email received in inbox
✅ Schedule nextDueDate updated to tomorrow
✅ Notification log created in database

---

## 🐛 Troubleshooting

### No email received?
1. Check spam folder
2. Check terminal logs for errors
3. Verify email notifications are enabled in Settings
4. Check the cron response - did it process any schedules?

### Cron says "processedCount: 0"?
1. Make sure the schedule time is in the PAST
2. Check that the schedule is active (not paused)
3. Verify the plant is not deleted

### "Unauthorized" error?
- Check that CRON_SECRET matches in .env
- Make sure you copied the full curl command

---

## 📊 Check Notification Logs

To see all notification attempts, query your database:

```sql
SELECT * FROM "NotificationLog" 
ORDER BY "createdAt" DESC 
LIMIT 5;
```

You should see a row with:
- channel: "EMAIL"
- status: "SENT"
- timestamp: Just now

---

## 🔄 Test Again

To test multiple times:
1. Delete the schedule
2. Create a new one with time in the past
3. Run the curl command again
4. Check email

Or just use the **"Send Test"** button in Settings for quick testing!
