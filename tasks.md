# Implementation Plan

## Overview

This implementation plan breaks down the Plant Care Reminder App into discrete, actionable coding tasks. Each task builds incrementally on previous work, ensuring continuous integration and avoiding orphaned code. Tasks are organized by feature area and prioritized for MVP delivery.

## Task List

- [ ] 1. Project initialization and core setup
- [ ] 1.1 Initialize Next.js 14+ project with TypeScript and App Router
  - Create new Next.js project with `npx create-next-app@latest`
  - Configure TypeScript in strict mode
  - Set up Tailwind CSS and PostCSS
  - Configure `next.config.ts` for image optimization and security headers
  - _Requirements: 10.1, 10.4, 11.3_

- [ ] 1.2 Install and configure core dependencies
  - Install Prisma, NextAuth.js v5, React Hook Form, Zod, TanStack Query, Zustand
  - Install shadcn/ui CLI and initialize component library
  - Install bcryptjs for password hashing
  - Configure package.json scripts for development and build
  - _Requirements: 10.1, 10.2_

- [ ] 1.3 Set up Prisma with PostgreSQL database
  - Initialize Prisma with `npx prisma init`
  - Create complete Prisma schema with User, Plant, CareSchedule, CareTask, NotificationLog models
  - Configure database connection string in .env.local
  - Run initial migration with `npx prisma migrate dev`
  - Generate Prisma client
  - Create lib/prisma.ts singleton client
  - _Requirements: 13.1, 13.3, 13.5_

- [ ] 1.4 Configure NextAuth.js v5 for authentication
  - Create auth.ts configuration file with Credentials provider
  - Set up JWT strategy and session callbacks
  - Configure bcrypt password hashing in authorize function
  - Create middleware.ts for route protection
  - Set up auth environment variables (NEXTAUTH_URL, NEXTAUTH_SECRET)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 10.1_

- [ ] 1.5 Set up project folder structure
  - Create app directory structure: (auth), (dashboard), api folders
  - Create components directory with ui, plants, schedules, tasks, layout, shared subfolders
  - Create lib directory with validations, notifications subfolders
  - Create hooks, store, types directories
  - Add .env.example file with all required environment variables
  - _Requirements: 11.1, 11.2_


- [ ] 2. Authentication system implementation
- [ ] 2.1 Create Zod validation schemas for authentication
  - Write auth validation schemas in lib/validations/auth.ts
  - Define schemas for signup, signin, password reset, confirm reset
  - Include email format validation and password strength rules (min 8 chars)
  - Export TypeScript types from schemas
  - _Requirements: 1.1, 1.3, 10.2_

- [ ] 2.2 Implement user registration API endpoint
  - Create POST /api/auth/signup route handler
  - Validate request body with Zod schema
  - Check for existing user with same email
  - Hash password with bcrypt (cost factor 10)
  - Create user record in database via Prisma
  - Return user data (excluding password) or error response
  - Implement rate limiting (5 requests per minute per IP)
  - _Requirements: 1.1, 10.1, 10.6_

- [ ] 2.3 Implement password reset API endpoints
  - Create POST /api/auth/reset-password route for requesting reset
  - Generate secure reset token and store with expiration
  - Send password reset email with token link
  - Create POST /api/auth/confirm-reset route for confirming reset
  - Validate token and expiration
  - Hash new password and update user record
  - _Requirements: 1.3, 1.4_

- [ ] 2.4 Create authentication UI pages
  - Build app/(auth)/signin/page.tsx with email/password form
  - Build app/(auth)/signup/page.tsx with registration form
  - Build app/(auth)/reset-password/page.tsx with email input form
  - Implement forms with React Hook Form and Zod validation
  - Add loading states and error message displays
  - Integrate with NextAuth.js signIn function
  - Add toast notifications for success/error feedback
  - _Requirements: 1.1, 1.2, 1.3, 12.2, 12.3, 12.4, 12.5_

- [ ] 2.5 Write unit tests for authentication validation schemas
  - Test valid and invalid email formats
  - Test password strength requirements
  - Test edge cases and boundary conditions
  - _Requirements: 10.2_


- [ ] 3. Image upload functionality
- [ ] 3.1 Set up Vercel Blob storage integration
  - Install @vercel/blob package
  - Configure BLOB_READ_WRITE_TOKEN environment variable
  - Create lib/upload.ts with uploadImage function
  - Implement file type validation (images only)
  - Implement file size validation (max 5MB)
  - _Requirements: 3.3_

- [ ] 3.2 Create image upload API endpoint
  - Create POST /api/upload route handler
  - Verify user authentication
  - Parse multipart/form-data with formData()
  - Validate file type and size
  - Upload to Vercel Blob and return URL
  - Handle upload errors with appropriate status codes
  - _Requirements: 3.3, 10.1_

- [ ] 3.3 Build reusable ImageUpload component
  - Create components/shared/image-upload.tsx
  - Implement drag-and-drop file input
  - Show image preview after selection
  - Display upload progress indicator
  - Handle upload errors with user-friendly messages
  - Return uploaded image URL to parent component
  - _Requirements: 3.3, 12.2, 12.3_

- [ ] 4. Plant management features
- [ ] 4.1 Create Zod validation schemas for plants
  - Write plant validation schemas in lib/validations/plant.ts
  - Define createPlantSchema with name (required), species, imageUrl, location, acquisitionDate, notes
  - Define updatePlantSchema (same as create)
  - Export TypeScript types from schemas
  - _Requirements: 3.1, 3.2, 10.2_

- [ ] 4.2 Implement Plant CRUD API endpoints
  - Create GET /api/plants route with pagination, search, and filtering
  - Create POST /api/plants route for creating plants
  - Create GET /api/plants/[id] route for single plant details
  - Create PUT /api/plants/[id] route for updating plants
  - Create DELETE /api/plants/[id] route for soft deleting plants
  - Validate all inputs with Zod schemas
  - Verify user authentication and ownership for all operations
  - Implement proper error handling and status codes
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 10.1, 10.2, 10.3, 13.1, 13.2_


- [ ] 4.3 Create React Query hooks for plant data fetching
  - Create hooks/use-plants.ts with usePlants, usePlant, useCreatePlant, useUpdatePlant, useDeletePlant hooks
  - Implement proper query keys for caching
  - Configure cache invalidation on mutations
  - Add error handling and loading states
  - _Requirements: 3.4, 3.5, 3.6, 12.2_

- [ ] 4.4 Build Zustand store for plant filters
  - Create store/use-plant-store.ts
  - Implement state for search, location, and species filters
  - Add actions for updating and clearing filters
  - _Requirements: 3.7, 3.8_

- [ ] 4.5 Create plant UI components
  - Build components/plants/plant-card.tsx to display plant summary
  - Build components/plants/plant-list.tsx with grid layout and pagination
  - Build components/plants/plant-form.tsx with all plant fields
  - Integrate ImageUpload component for plant photos
  - Use React Hook Form with Zod validation
  - Add loading spinners and error messages
  - Implement responsive design with Tailwind CSS
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 11.3, 12.1, 12.2, 12.3, 12.4, 12.6_

- [ ] 4.6 Build plant management pages
  - Create app/(dashboard)/plants/page.tsx for plant list with search and filters
  - Create app/(dashboard)/plants/new/page.tsx for add plant form
  - Create app/(dashboard)/plants/[id]/page.tsx for plant details view
  - Create app/(dashboard)/plants/[id]/edit/page.tsx for edit plant form
  - Integrate plant components and hooks
  - Add navigation between pages
  - Implement delete confirmation dialog
  - _Requirements: 3.1, 3.4, 3.5, 3.6, 3.7, 3.8, 12.1, 12.5_

- [ ] 4.7 Write integration tests for plant CRUD operations
  - Test plant creation with valid and invalid data
  - Test plant list retrieval with filters
  - Test plant update and delete operations
  - Test authorization (users can only access their own plants)
  - _Requirements: 3.1, 3.2, 3.5, 3.6, 10.1_


- [ ] 5. Care schedule management
- [ ] 5.1 Create Zod validation schemas for schedules
  - Write schedule validation schemas in lib/validations/schedule.ts
  - Define createScheduleSchema with plantId, taskType, frequencyDays, timeOfDay, startDate, notes
  - Define updateScheduleSchema (excluding plantId)
  - Add validation for taskType enum (WATERING, FERTILIZING)
  - Add validation for timeOfDay format (HH:MM)
  - Export TypeScript types from schemas
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 10.2_

- [ ] 5.2 Create date utility functions for schedule calculations
  - Create lib/date-utils.ts with helper functions
  - Implement calculateNextDueDate(startDate, frequencyDays, timeOfDay)
  - Implement addDaysToDate(date, days) for updating schedules
  - Implement formatDate and parseDate utilities
  - _Requirements: 4.2, 4.5_

- [ ] 5.3 Implement Care Schedule CRUD API endpoints
  - Create GET /api/schedules route for all user schedules
  - Create GET /api/schedules/plant/[plantId] route for plant-specific schedules
  - Create POST /api/schedules route with automatic nextDueDate calculation
  - Create PUT /api/schedules/[id] route with nextDueDate recalculation
  - Create PATCH /api/schedules/[id]/toggle route for pause/resume
  - Create DELETE /api/schedules/[id] route for soft delete
  - Validate all inputs with Zod schemas
  - Verify user authentication and plant ownership
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 10.1, 10.2, 13.1, 13.2_

- [ ] 5.4 Create React Query hooks for schedule data
  - Create hooks/use-schedules.ts with useSchedules, useSchedulesByPlant, useCreateSchedule, useUpdateSchedule, useToggleSchedule, useDeleteSchedule hooks
  - Implement proper query keys and cache invalidation
  - Add error handling and loading states
  - _Requirements: 4.1, 4.2, 4.5, 12.2_

- [ ] 5.5 Build schedule UI components
  - Create components/schedules/schedule-card.tsx to display schedule details
  - Create components/schedules/schedule-form.tsx with all schedule fields
  - Add task type selector (WATERING, FERTILIZING)
  - Add frequency input (number of days)
  - Add time picker for timeOfDay
  - Add date picker for startDate
  - Use React Hook Form with Zod validation
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 12.1, 12.4_


- [ ] 5.6 Build schedule management pages
  - Create app/(dashboard)/schedules/page.tsx for schedule list
  - Create app/(dashboard)/schedules/new/page.tsx for add schedule form
  - Add plant selector dropdown in schedule form
  - Display schedule list grouped by plant
  - Add pause/resume toggle buttons
  - Add edit and delete actions
  - Implement delete confirmation dialog
  - _Requirements: 4.1, 4.2, 4.5, 4.6, 4.7, 4.8, 12.1, 12.5_

- [ ] 5.7 Write unit tests for date utility functions
  - Test calculateNextDueDate with various inputs
  - Test edge cases (leap years, month boundaries)
  - Test timezone handling
  - _Requirements: 4.2, 4.5_

- [ ] 6. Task completion and care history
- [ ] 6.1 Create Zod validation schemas for tasks
  - Write task validation schemas in lib/validations/task.ts
  - Define completeTaskSchema with scheduleId, notes, photoUrl
  - Export TypeScript types from schemas
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 10.2_

- [ ] 6.2 Implement Care Task API endpoints
  - Create GET /api/tasks route for upcoming tasks with date range filter
  - Create POST /api/tasks/complete route for marking tasks complete
  - Create GET /api/tasks/history route for completed tasks with pagination
  - Create GET /api/tasks/plant/[plantId]/history route for plant-specific history
  - Implement task completion logic: create CareTask record and update schedule nextDueDate
  - Validate all inputs with Zod schemas
  - Verify user authentication and ownership
  - _Requirements: 5.1, 5.4, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 10.1, 10.2, 13.1_

- [ ] 6.3 Create React Query hooks for task data
  - Create hooks/use-tasks.ts with useTasks, useTaskHistory, useCompleteTask, usePlantHistory hooks
  - Implement proper query keys and cache invalidation
  - Invalidate schedule queries when task is completed
  - Add error handling and loading states
  - _Requirements: 5.4, 6.1, 6.5, 12.2_


- [ ] 6.4 Build task UI components
  - Create components/tasks/task-card.tsx to display task details with plant info
  - Create components/tasks/task-list.tsx with filtering by date range
  - Create components/tasks/complete-task-dialog.tsx with notes and photo upload
  - Add "Mark Complete" button that opens dialog
  - Integrate ImageUpload component for task photos
  - Use React Hook Form for completion form
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 12.1, 12.4, 12.5_

- [ ] 6.5 Build task and history pages
  - Create app/(dashboard)/tasks/page.tsx for upcoming tasks view
  - Create app/(dashboard)/tasks/history/page.tsx for completed tasks
  - Add date range filter for upcoming tasks
  - Display tasks grouped by date or plant
  - Show task completion dialog on "Mark Complete" click
  - Display care history with timeline view
  - Show task photos and notes in history
  - Implement pagination for history
  - _Requirements: 5.1, 5.2, 5.4, 6.1, 6.5, 6.6, 11.5, 12.1_

- [ ] 6.6 Write integration tests for task completion flow
  - Test task completion with and without notes/photos
  - Test schedule nextDueDate update after completion
  - Test task history retrieval
  - _Requirements: 6.1, 6.2, 6.5_

- [ ] 7. Dashboard and navigation
- [ ] 7.1 Create dashboard layout components
  - Build components/layout/header.tsx with app logo and user menu
  - Build components/layout/nav.tsx with navigation links
  - Build components/layout/footer.tsx with copyright info
  - Create app/(dashboard)/layout.tsx using layout components
  - Add logout functionality in user menu
  - Implement responsive mobile navigation
  - _Requirements: 12.1, 12.6_

- [ ] 7.2 Build dashboard home page
  - Create app/(dashboard)/page.tsx
  - Display tasks due today section
  - Display upcoming tasks (next 7 days) section
  - Display total plants count statistic
  - Display recently added plants section
  - Add quick action buttons: Add Plant, View All Tasks, View All Plants
  - Fetch data using React Query hooks
  - Implement loading states for each section
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 11.1, 12.1, 12.2_


- [ ] 7.3 Create shared UI components
  - Build components/shared/loading-spinner.tsx for loading states
  - Build components/shared/error-message.tsx for error displays
  - Build components/ui components from shadcn/ui: button, input, card, dialog, form, toast
  - Configure toast provider in root layout
  - Add error boundary component for graceful error handling
  - _Requirements: 12.2, 12.3, 12.5_

- [ ] 7.4 Implement global state and providers
  - Create contexts/auth-context.tsx for user session
  - Set up TanStack Query provider in root layout
  - Configure query client with default options (staleTime, cacheTime)
  - Add SessionProvider from NextAuth.js
  - Wrap app with all providers in correct order
  - _Requirements: 1.5, 12.2_

- [ ] 7.5 Create landing page for unauthenticated users
  - Build app/page.tsx with hero section
  - Add features section highlighting key functionality
  - Add call-to-action buttons (Sign Up, Sign In)
  - Implement responsive design
  - Add basic SEO metadata
  - _Requirements: 12.1_

- [ ] 8. Notification preferences and setup
- [ ] 8.1 Create notification preferences API endpoints
  - Create POST /api/notifications/subscribe route for storing FCM token
  - Create PUT /api/notifications/preferences route for updating preferences
  - Create POST /api/notifications/test route for sending test notifications
  - Update User model notificationPreferences JSON field
  - Verify user authentication
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 10.1_

- [ ] 8.2 Build notification preferences UI
  - Create app/(dashboard)/settings/page.tsx for user settings
  - Add toggle switches for push and email notifications
  - Add time picker for preferred notification time
  - Add toggle for daily digest option
  - Add "Send Test Notification" button
  - Use React Hook Form for preferences form
  - Save preferences via API on change
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 12.4_


- [ ] 9. Email notification system
- [ ] 9.1 Set up Resend email service integration
  - Install resend package
  - Configure RESEND_API_KEY environment variable
  - Create lib/notifications/email.ts with sendEmailNotification function
  - Create generateTaskReminderEmail function for HTML email template
  - Test email sending with test endpoint
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 9.2 Implement email notification logic in cron job
  - Update cron job to check user email preferences
  - Send email notifications for due tasks when enabled
  - Log email notification attempts to NotificationLog table
  - Handle email sending errors gracefully
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.3, 9.4, 9.5_

- [ ] 9.3 Write integration tests for email notifications
  - Test email sending with mock Resend API
  - Test email template generation
  - Test error handling
  - _Requirements: 8.2, 8.3_

- [ ] 10. Push notification system
- [ ] 10.1 Set up Firebase Cloud Messaging
  - Create Firebase project and enable FCM
  - Install firebase and firebase-admin packages
  - Configure Firebase environment variables (project ID, client email, private key)
  - Add public Firebase config variables for client-side
  - Create lib/notifications/push.ts with sendPushNotification function using firebase-admin
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 10.2 Implement service worker for push notifications
  - Create public/firebase-messaging-sw.js service worker
  - Initialize Firebase in service worker
  - Implement onBackgroundMessage handler
  - Register service worker in app
  - _Requirements: 7.1, 7.2, 7.5_

- [ ] 10.3 Build push notification permission flow
  - Create hooks/use-notifications.ts for requesting permission
  - Request notification permission on settings page
  - Get FCM token after permission granted
  - Send token to server via /api/notifications/subscribe
  - Store token in user preferences
  - Handle permission denied gracefully
  - _Requirements: 7.1, 7.3, 7.5_


- [ ] 10.4 Implement push notification logic in cron job
  - Update cron job to check user push preferences
  - Send push notifications for due tasks when enabled and FCM token exists
  - Include scheduleId and plantId in notification data
  - Log push notification attempts to NotificationLog table
  - Handle FCM errors (invalid token, etc.)
  - _Requirements: 7.1, 7.2, 7.4, 9.3, 9.4, 9.5_

- [ ] 10.5 Implement notification click handling
  - Add click handler in service worker to open app
  - Navigate to task completion page when notification clicked
  - Pass scheduleId from notification data
  - _Requirements: 7.2_

- [ ] 10.6 Write integration tests for push notifications
  - Test FCM token storage
  - Test push notification sending with mock Firebase
  - Test error handling for invalid tokens
  - _Requirements: 7.1, 7.2, 7.4_

- [ ] 11. Automated task checking with Vercel Cron
- [ ] 11.1 Create cron job API endpoint
  - Create GET /api/cron/check-tasks route handler
  - Implement authorization check with CRON_SECRET header
  - Query active schedules where nextDueDate <= now
  - Loop through due schedules and process each one
  - Get user notification preferences for each schedule
  - Send push and/or email notifications based on preferences
  - Update schedule nextDueDate by adding frequencyDays
  - Log all notification attempts to NotificationLog
  - Return summary: processed count, notifications sent, errors
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 11.2 Configure Vercel Cron Job
  - Create vercel.json with cron configuration
  - Set cron schedule to run every hour (0 * * * *)
  - Set path to /api/cron/check-tasks
  - Configure CRON_SECRET environment variable in Vercel
  - Test cron job execution locally
  - _Requirements: 9.1, 9.2_

- [ ] 11.3 Write integration tests for cron job logic
  - Test due schedule detection
  - Test notification sending based on preferences
  - Test nextDueDate calculation and update
  - Test error handling and logging
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_


- [ ] 12. Security hardening and error handling
- [ ] 12.1 Implement rate limiting middleware
  - Create lib/rate-limit.ts with LRU cache-based rate limiter
  - Apply rate limiting to authentication endpoints (5 requests/minute)
  - Apply rate limiting to sensitive endpoints (upload, etc.)
  - Return 429 status code when rate limit exceeded
  - _Requirements: 10.6_

- [ ] 12.2 Add comprehensive error handling
  - Create lib/api-client.ts with ApiError class
  - Implement consistent error response format across all API routes
  - Add error codes for different error types
  - Create error boundary component for client-side errors
  - Add global error handler in root layout
  - _Requirements: 12.3_

- [ ] 12.3 Implement input validation and sanitization
  - Ensure all API routes validate inputs with Zod
  - Add server-side validation even when client-side exists
  - Validate file uploads (type, size, content)
  - Add CSRF protection via NextAuth.js
  - Configure Content Security Policy headers
  - _Requirements: 10.2, 10.3, 10.4, 10.5_

- [ ] 12.4 Add authorization checks to all protected routes
  - Verify user authentication in all API routes
  - Verify resource ownership (user can only access their own data)
  - Return 401 for unauthenticated requests
  - Return 403 for unauthorized access attempts
  - Test authorization with different user scenarios
  - _Requirements: 10.1, 10.7_

- [ ] 12.5 Write security tests
  - Test authentication bypass attempts
  - Test authorization violations
  - Test SQL injection prevention
  - Test XSS prevention
  - Test rate limiting
  - _Requirements: 10.1, 10.2, 10.3, 10.6_


- [ ] 13. Performance optimization
- [ ] 13.1 Optimize database queries
  - Add database indexes to frequently queried fields
  - Use Prisma select to fetch only needed fields
  - Implement pagination for all list endpoints
  - Add connection pooling configuration
  - Test query performance with explain analyze
  - _Requirements: 11.2, 11.5, 13.4, 13.5_

- [ ] 13.2 Implement image optimization
  - Use Next.js Image component throughout app
  - Configure image domains in next.config.ts
  - Add lazy loading to plant images
  - Implement blur placeholder for images
  - Optimize image sizes and formats
  - _Requirements: 11.3, 11.4_

- [ ] 13.3 Configure caching strategies
  - Set up React Query with appropriate staleTime and cacheTime
  - Add cache headers to API responses where appropriate
  - Implement optimistic updates for mutations
  - Configure Next.js static generation for landing page
  - _Requirements: 11.1, 11.2_

- [ ] 13.4 Add loading states and skeleton screens
  - Create skeleton components for plant cards, task cards
  - Add loading spinners to all async operations
  - Implement suspense boundaries where appropriate
  - Add progress indicators for image uploads
  - _Requirements: 12.2_

- [ ] 13.5 Run performance tests and optimize
  - Test initial page load time (target < 2s)
  - Test API response times (target < 500ms)
  - Use Lighthouse to identify bottlenecks
  - Optimize bundle size with code splitting
  - _Requirements: 11.1, 11.2_

- [ ] 14. Accessibility and responsive design
- [ ] 14.1 Implement responsive layouts
  - Ensure all pages work on mobile, tablet, desktop
  - Use Tailwind responsive utilities (sm:, md:, lg:)
  - Test navigation on mobile devices
  - Implement mobile-friendly forms
  - Add touch-friendly button sizes
  - _Requirements: 12.1_


- [ ] 14.2 Add accessibility features
  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works throughout app
  - Add focus indicators for keyboard users
  - Test with screen reader
  - Add alt text to all images
  - Ensure proper heading hierarchy
  - Add skip-to-content link
  - _Requirements: 12.6, 12.7_

- [ ] 14.3 Implement form accessibility
  - Associate labels with form inputs
  - Add error announcements for screen readers
  - Ensure form validation messages are accessible
  - Add required field indicators
  - Test forms with keyboard only
  - _Requirements: 12.4, 12.6, 12.7_

- [ ] 14.4 Run accessibility audit
  - Use axe DevTools to check for issues
  - Test with keyboard navigation
  - Test with screen reader (NVDA or VoiceOver)
  - Fix any identified issues
  - _Requirements: 12.6, 12.7_

- [ ] 15. Testing and quality assurance
- [ ] 15.1 Set up testing infrastructure
  - Install Vitest and React Testing Library
  - Install Playwright for e2e tests
  - Configure test scripts in package.json
  - Set up test database for integration tests
  - Create test utilities and helpers
  - _Requirements: All_

- [ ] 15.2 Write end-to-end tests
  - Test user registration and login flow
  - Test plant CRUD operations
  - Test schedule creation and management
  - Test task completion flow
  - Test notification preferences
  - _Requirements: 1.1, 3.1, 4.1, 6.1, 2.2_

- [ ] 15.3 Run full test suite and fix issues
  - Run all unit tests
  - Run all integration tests
  - Run all e2e tests
  - Fix any failing tests
  - Achieve target code coverage
  - _Requirements: All_


- [ ] 16. Deployment and production setup
- [ ] 16.1 Configure production environment
  - Set up production database (Vercel Postgres/Supabase/Neon)
  - Configure all environment variables in Vercel dashboard
  - Set up Vercel Blob storage for production
  - Configure Firebase project for production
  - Set up Resend account and verify domain
  - Generate and store CRON_SECRET
  - _Requirements: 13.1_

- [ ] 16.2 Set up database migrations for production
  - Create production migration strategy
  - Run prisma migrate deploy in production
  - Verify database schema in production
  - Set up automatic migrations in build process
  - _Requirements: 13.1, 13.3_

- [ ] 16.3 Configure Vercel deployment
  - Connect GitHub repository to Vercel
  - Configure build settings (Next.js detected automatically)
  - Set up preview deployments for pull requests
  - Configure custom domain (optional)
  - Enable Vercel Analytics
  - _Requirements: 11.1_

- [ ] 16.4 Test production deployment
  - Deploy to production
  - Test all core functionality in production
  - Verify cron job execution
  - Test email and push notifications
  - Monitor for errors in Vercel logs
  - _Requirements: All_

- [ ] 16.5 Create deployment documentation
  - Document environment variables needed
  - Document deployment process
  - Document database migration process
  - Document monitoring and debugging procedures
  - Create troubleshooting guide
  - _Requirements: All_

## Definition of Done

### Phase 1 (MVP) - Core Features
- Users can register, login, and reset passwords
- Users can add, view, edit, and delete plants with photos
- Users can create care schedules with frequency and timing
- Users can view upcoming tasks
- Users can mark tasks as complete
- Basic dashboard shows tasks and plant summary
- All data persists in database
- App is responsive and works on mobile

### Phase 2 - Notifications
- Cron job runs hourly and checks for due tasks
- Email notifications sent for due tasks
- Users can configure notification preferences
- Notification logs track delivery status
- Task completion updates schedule automatically

### Phase 3 - Enhanced Features
- Push notifications work in browser
- Users can upload photos when completing tasks
- Care history displays with timeline view
- Search and filter work for plants
- Calendar view for tasks (optional)
- Full accessibility compliance
- Performance targets met (< 2s load, < 500ms API)

## Sprint Breakdown (2-week sprints)

**Sprint 1**: Tasks 1-2 (Project setup, Authentication)
**Sprint 2**: Tasks 3-4 (Image upload, Plant management)
**Sprint 3**: Tasks 5-6 (Schedules, Task completion)
**Sprint 4**: Tasks 7-8 (Dashboard, Notification preferences)
**Sprint 5**: Tasks 9-11 (Email, Push, Cron job)
**Sprint 6**: Tasks 12-14 (Security, Performance, Accessibility)
**Sprint 7**: Tasks 15-16 (Testing, Deployment)

## Dependencies

- Task 2 depends on Task 1 (auth needs project setup)
- Task 3 can be done in parallel with Task 2
- Task 4 depends on Tasks 1, 2, 3 (plants need auth and upload)
- Task 5 depends on Task 4 (schedules need plants)
- Task 6 depends on Task 5 (tasks need schedules)
- Task 7 depends on Tasks 4, 5, 6 (dashboard needs data)
- Task 8 depends on Task 1 (preferences need auth)
- Tasks 9-10 depend on Task 8 (notifications need preferences)
- Task 11 depends on Tasks 5, 9, 10 (cron needs schedules and notifications)
- Tasks 12-14 can be done in parallel after core features
- Task 15 depends on all feature tasks
- Task 16 depends on Task 15 (deploy after testing)

## Notes

- All tasks are required for comprehensive coverage
- Test each feature as it's built, don't wait until the end
- Keep code modular and reusable
- Follow TypeScript strict mode - no `any` types without justification
- Use consistent naming conventions throughout
- Document complex logic with comments
- Keep components small and focused on single responsibility
