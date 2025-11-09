# 🌱 Plant Care Reminder App

A full-stack web application to help you manage and care for your plants with automated reminders and care tracking.

## ✨ Features

### Plant Management
- 📸 Add plants with photos
- 🏷️ Track species, location, and acquisition date
- 📝 Add custom notes for each plant
- 🔍 Search and filter plants by name, species, or location
- ✏️ Edit and delete plants

### Care Scheduling
- ⏰ Create watering and fertilizing schedules
- 📅 Set custom frequency (every X days)
- 🕐 Specify preferred time of day
- ⏸️ Pause and resume schedules
- 🔄 Automatic schedule updates after task completion

### Task Management
- ✅ View tasks due today
- 📆 See upcoming tasks (next 7 days)
- 📷 Add photos when completing tasks
- 📝 Add notes to track care history
- 📊 View complete care history for each plant

### Notifications
- 📧 Email notifications for due tasks
- 🔔 Push notifications in browser
- ⚙️ Customizable notification preferences
- 🕐 Set preferred notification time
- 📬 Daily digest option

### Dashboard
- 📊 Overview of all plants and tasks
- 🎯 Quick stats (total plants, tasks today, upcoming tasks)
- 🚀 Quick actions to add plants and schedules
- 📱 Responsive design for mobile and desktop

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Zustand** - State management

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma** - ORM and database management
- **PostgreSQL** - Database
- **NextAuth.js v5** - Authentication
- **bcryptjs** - Password hashing

### Services
- **Vercel** - Hosting and deployment
- **Vercel Blob** - Image storage
- **Vercel Cron** - Scheduled tasks
- **Firebase Cloud Messaging** - Push notifications
- **Resend** - Email notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database
- Vercel account (for deployment)
- Firebase project (for push notifications)
- Resend account (for email notifications)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd plant-care-app
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/plantcare"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your-blob-token"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="your-vapid-key"

FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-key\n-----END PRIVATE KEY-----\n"

# Resend
RESEND_API_KEY="re_your_api_key"

# Cron
CRON_SECRET="your-cron-secret"
```

4. **Set up the database**
```bash
# Generate Prisma Client
bun prisma:generate

# Run migrations
bun prisma:migrate

# (Optional) Open Prisma Studio to view data
bun prisma:studio
```

5. **Run the development server**
```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
plant-care-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (signin, signup)
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── plants/           # Plant-related components
│   │   ├── schedules/        # Schedule components
│   │   ├── tasks/            # Task components
│   │   ├── shared/           # Shared components
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   │   ├── validations/     # Zod schemas
│   │   └── notifications/   # Email & push logic
│   ├── store/               # Zustand stores
│   └── generated/           # Generated Prisma Client
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static files
└── tests/                   # Test files
```

## 🔐 Authentication

The app uses NextAuth.js v5 with credentials provider:
- Email/password authentication
- Password hashing with bcryptjs
- JWT-based sessions
- Password reset functionality
- Protected routes with middleware

## 📊 Database Schema

### Models
- **User** - User accounts and preferences
- **Plant** - Plant information
- **CareSchedule** - Care schedules for plants
- **CareTask** - Completed care tasks (history)
- **NotificationLog** - Notification delivery logs

See `prisma/schema.prisma` for the complete schema.

## 🔔 Notifications

### Email Notifications
- Powered by Resend
- Sent for tasks due today
- Customizable in user settings
- HTML email templates

### Push Notifications
- Powered by Firebase Cloud Messaging
- Browser-based notifications
- Service worker for background notifications
- Click to open app

### Cron Job
- Runs every hour via Vercel Cron
- Checks for due tasks
- Sends notifications based on user preferences
- Updates schedule next due dates
- Logs all notification attempts

## 🎨 UI/UX Features

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dark Mode Ready** - Built with theme support
- **Accessibility** - WCAG 2.1 Level AA compliant
- **Loading States** - Skeleton screens and spinners
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback
- **Optimistic Updates** - Instant UI updates

## 🧪 Testing

```bash
# Run all tests
bun test

# Run with coverage
bun test:coverage

# Run E2E tests
bun test:e2e

# Run E2E tests with UI
bun test:e2e:ui
```

## 📦 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Add environment variables
- Deploy

3. **Set up services**
- Configure Vercel Blob storage
- Set up Firebase project
- Configure Resend domain
- Add cron secret

See `DEPLOYMENT_COMPLETE.md` for detailed deployment instructions.

## 🔧 Configuration

### Next.js Config
- Image optimization enabled
- Security headers configured
- API routes protected

### Prisma Config
- PostgreSQL database
- Connection pooling
- Soft deletes implemented

### TanStack Query Config
- 5-minute stale time
- 10-minute cache time
- Optimistic updates enabled

## 📝 Scripts

```bash
# Development
bun dev                 # Start dev server
bun build              # Build for production
bun start              # Start production server

# Database
bun prisma:generate    # Generate Prisma Client
bun prisma:migrate     # Run migrations
bun prisma:studio      # Open Prisma Studio

# Testing
bun test               # Run tests
bun test:e2e          # Run E2E tests
bun test:coverage     # Generate coverage report

# Linting
bun lint              # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/)
- [Firebase](https://firebase.google.com/)
- [Resend](https://resend.com/)

## 📧 Support

For support, email your-email@example.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Plant disease detection with AI
- [ ] Community features (share plants, tips)
- [ ] Integration with smart home devices
- [ ] Weather-based watering recommendations
- [ ] Plant care guides and tips
- [ ] Multiple user accounts per household
- [ ] Export care history as PDF

---

Made with ❤️ and ☕
