# Known Issues

## Build Type Errors (Next.js 16)

### Issue
The production build fails with TypeScript errors related to route params being Promises in Next.js 15+.

### Error Messages
```
Type '{ params: Promise<{ id: string; }>; }' is not assignable to type '{ params: { id: string; }; }'
```

### Cause
Next.js 15+ introduced a breaking change where route params are now async (Promise-based). The current implementation uses the synchronous params pattern from Next.js 14.

### Impact
- Development server works fine
- All functionality is operational
- Only affects production build type checking

### Solution
Update all dynamic route handlers to use async params:

**Before (Next.js 14):**
```typescript
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  // ...
}
```

**After (Next.js 15+):**
```typescript
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // ...
}
```

### Files to Update
- `src/app/api/plants/[id]/route.ts`
- `src/app/api/schedules/[id]/route.ts`
- `src/app/api/schedules/[id]/toggle/route.ts`
- `src/app/api/tasks/plant/[plantId]/history/route.ts`
- Any other dynamic route handlers

### Workaround
For immediate deployment, you can:
1. Downgrade to Next.js 14: `bun add next@14`
2. Or disable type checking in build: Add `typescript: { ignoreBuildErrors: true }` to `next.config.ts`
3. Or update all route handlers to use async params (recommended)

### References
- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [Dynamic Route Segments](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)

## Firebase Service Worker Configuration

### Issue
The `public/firebase-messaging-sw.js` file contains placeholder Firebase configuration values.

### Impact
Push notifications will not work until Firebase is properly configured.

### Solution
1. Create a Firebase project
2. Enable Cloud Messaging
3. Replace placeholder values in `firebase-messaging-sw.js` with actual Firebase config
4. Update environment variables with Firebase credentials

## Missing PWA Icons

### Issue
The PWA manifest references icon files that don't exist:
- `/icon-192x192.png`
- `/icon-512x512.png`
- `/badge-72x72.png`

### Impact
- PWA installation may not work properly
- App icon won't display correctly on mobile devices

### Solution
1. Create app icons in the required sizes
2. Place them in the `public/` directory
3. Or update `public/manifest.json` to reference existing icons

## Email Sender Domain

### Issue
Email notifications are sent from `onboarding@resend.dev` (Resend's test domain).

### Impact
- Emails may be marked as spam
- Limited to 100 emails/day on free tier
- Not suitable for production

### Solution
1. Verify your own domain in Resend
2. Update the sender email in `src/lib/notifications/email.ts`
3. Configure SPF and DKIM records for your domain

## Rate Limiting Storage

### Issue
Rate limiting uses in-memory Map storage, which resets on server restart.

### Impact
- Rate limits reset when the server restarts
- Not suitable for multi-instance deployments
- Memory usage grows over time (mitigated by cleanup logic)

### Solution
For production, consider using:
- Redis for distributed rate limiting
- Upstash Rate Limit
- Vercel KV
- Or a database-backed solution

## Database Connection Pooling

### Issue
The current Prisma setup doesn't explicitly configure connection pooling.

### Impact
- May hit connection limits under high load
- Potential performance issues

### Solution
1. Use Prisma Data Proxy or Accelerate for connection pooling
2. Or configure connection pooling in your database provider
3. Or use a connection pooler like PgBouncer

## No Error Monitoring

### Issue
No error tracking or monitoring service is integrated.

### Impact
- Difficult to debug production issues
- No visibility into errors users encounter

### Solution
Integrate an error monitoring service:
- Sentry
- LogRocket
- Datadog
- Vercel Error Tracking

## No Analytics

### Issue
No analytics or user tracking is implemented.

### Impact
- No visibility into user behavior
- Can't track feature usage
- Can't measure performance metrics

### Solution
Add analytics:
- Vercel Analytics (already available, just needs enabling)
- Google Analytics
- Plausible
- PostHog

## Testing Coverage

### Issue
No automated tests are implemented.

### Impact
- Risk of regressions when making changes
- Difficult to refactor with confidence
- No CI/CD validation

### Solution
Implement testing:
1. Unit tests for utilities and validation schemas
2. Integration tests for API endpoints
3. E2E tests for critical user flows
4. Set up CI/CD pipeline with test automation

## Accessibility Audit Needed

### Issue
No formal accessibility audit has been performed.

### Impact
- May not be usable by people with disabilities
- Potential legal compliance issues
- Poor user experience for some users

### Solution
1. Run axe DevTools audit
2. Test with screen readers
3. Verify keyboard navigation
4. Add ARIA labels where needed
5. Ensure proper color contrast

## Performance Not Measured

### Issue
No performance benchmarks or monitoring in place.

### Impact
- Don't know if performance targets are met
- Can't identify bottlenecks
- No baseline for optimization

### Solution
1. Run Lighthouse audits
2. Set up Vercel Analytics
3. Monitor Core Web Vitals
4. Profile database queries
5. Set performance budgets

---

**Note**: These are known issues that don't prevent the app from functioning but should be addressed before production deployment or as part of ongoing maintenance.
