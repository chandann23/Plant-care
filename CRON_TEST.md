# Cron Job Testing Guide

## ✅ Configuration Status

Your cron job is properly configured:

- **Endpoint**: `/api/cron/check-tasks`
- **Schedule**: `0 * * * *` (runs every hour)
- **Authentication**: Bearer token with CRON_SECRET
- **CRON_SECRET**: Set in `.env` ✓

## 🧪 How to Test Locally

### 1. Start your development server
```bash
bun dev
```

### 2. Test the cron endpoint manually

Open a new terminal and run:

```bash
curl -X GET http://localhost:3000/api/cron/check-tasks \
  -H "Authorization: Bearer 2364dcfe0d4b2face937fe20a2c79d235795798d3b33431b6f28a399356db1b7"
```

### 3. Expected Response

**If no tasks are due:**
```json
{
  "success": true,
  "processedCount": 0,
  "notificationsSent": 0,
  "timestamp": "2025-11-13T..."
}
```

**If tasks are due:**
```json
{
  "success": true,
  "processedCount": 2,
  "notificationsSent": 3,
  "timestamp": "2025-11-13T..."
}
```

**If unauthorized:**
```json
{
  "error": "Unauthorized"
}
```

## 🔍 What the Cron Job Does

1. **Finds due schedules**: Queries all active schedules where `nextDueDate <= now`
2. **Sends notifications**: 
   - Email notifications (if user has email enabled)
   - Push notifications (if user has push enabled and FCM token)
3. **Updates schedules**: Adds `frequencyDays` to `nextDueDate`
4. **Logs everything**: Creates `NotificationLog` entries for tracking

## 📊 Testing Scenarios

### Scenario 1: Create a Due Schedule

1. Add a plant
2. Create a care schedule with:
   - Start date: Today
   - Time: Current time (or past)
   - Frequency: 1 day
3. Wait for the schedule to become due
4. Run the cron endpoint manually
5. Check:
   - Email received (if email enabled)
   - Push notification (if push enabled)
   - Schedule `nextDueDate` updated to tomorrow

### Scenario 2: Test Notification Preferences

1. Go to Settings page
2. Toggle email/push notifications
3. Create a due schedule
4. Run cron endpoint
5. Verify only enabled notification types are sent

### Scenario 3: Check Notification Logs

Query the database:
```sql
SELECT * FROM "NotificationLog" 
ORDER BY "createdAt" DESC 
LIMIT 10;
```

## 🚀 Production Deployment

When deployed to Vercel:

1. **Automatic execution**: Vercel will call the endpoint every hour
2. **Environment variables**: Make sure to set `CRON_SECRET` in Vercel dashboard
3. **Monitoring**: Check Vercel logs for cron execution
4. **Notification logs**: Query `NotificationLog` table to see delivery status

## 🔐 Security

- The endpoint requires `Authorization: Bearer <CRON_SECRET>` header
- Returns 401 if secret is missing or incorrect
- Only Vercel (in production) or authorized requests can trigger it

## 📝 Monitoring

Check these to verify cron is working:

1. **Vercel Logs**: See cron execution logs
2. **NotificationLog table**: See all notification attempts
3. **Schedule nextDueDate**: Should update after each run
4. **User emails**: Should receive notifications when due

## 🐛 Troubleshooting

**No notifications sent?**
- Check user notification preferences are enabled
- Verify email/FCM token is set
- Check schedule is active and not deleted
- Verify schedule nextDueDate is in the past

**Cron not running?**
- Check CRON_SECRET is set in Vercel
- Verify vercel.json is deployed
- Check Vercel logs for errors

**Emails not sending?**
- Verify RESEND_API_KEY is set
- Check Resend dashboard for delivery status
- Note: In testing, emails only go to verified address

**Push not working?**
- Verify Firebase credentials are set
- Check FCM token is valid
- Test with "Send Test Notification" in Settings
