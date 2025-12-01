# Frontend User - Laboratory Information System

Modern Next.js 15 patient portal for laboratory services, built with TypeScript, Redux, and HeroUI.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

## ✨ Features

- 🔐 **Patient Authentication** - Secure login/signup with JWT
- 📋 **Medical Records** - View personal test results and history
- 📅 **Appointment Booking** - Schedule laboratory tests
- 🧪 **Test Results** - Access detailed test results with PDF export
- 📊 **Health Dashboard** - Visualize health trends over time
- 🔔 **Notifications** - Real-time updates on test results
- 🌓 **Dark Mode** - Full dark/light theme support
- 📱 **Mobile-First** - Optimized for mobile devices
- 🎨 **Modern UI** - Built with HeroUI components
- 🔒 **HIPAA Compliant** - Secure patient data handling

## 🛠 Tech Stack

### Core
- **Next.js 15.5** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

### State & Data
- **Redux Toolkit** - State management
- **Redux Persist** - State persistence
- **SWR** - Data fetching and caching
- **Axios** - HTTP client

### UI & Design
- **HeroUI** - Component library
- **Framer Motion** - Smooth animations
- **next-themes** - Theme management
- **react-icons** - Icon library

### Forms & Validation
- **Formik** - Form management
- **Yup** - Schema validation

### Testing
- **Jest 30** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Utilities
- **dayjs** - Date manipulation
- **crypto-js** - Data encryption
- **react-hot-toast** - Notifications
- **jsPDF** - PDF generation

## 📁 Project Structure

```
frontend-user/
├── public/                 # Static assets
│   ├── fonts/             # Custom fonts
│   ├── images/            # Images and logos
│   └── videos/            # Video assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/       # Auth routes (login, register)
│   │   ├── (dashboard)/  # Dashboard routes (home)
│   │   ├── (service)/    # Service routes (appointments)
│   │   ├── (user)/       # User routes (profile, records)
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Landing page
│   │   └── providers.tsx # Client providers
│   ├── components/        # React components
│   │   ├── modules/      # Feature components
│   │   │   ├── Modal/    # Modal dialogs
│   │   │   └── SwitchTheme/ # Theme switcher
│   │   ├── shared/       # Reusable components
│   │   │   ├── appointment/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   ├── profile/
│   │   │   └── test-result/
│   │   └── styled/       # Styled components
│   ├── hook/             # Custom hooks
│   │   ├── reuseable/    # Reusable hooks
│   │   └── singleton/    # Singleton hooks (SWR)
│   ├── libs/             # Library wrappers
│   │   ├── fetcher.ts    # SWR fetcher
│   │   └── ProtectedRoute.tsx
│   ├── modules/          # Business logic
│   │   ├── CropImage/    # Image cropping
│   │   ├── day/          # Date utilities
│   │   ├── encrypt/      # Encryption helpers
│   │   └── profile/      # Profile helpers
│   ├── provider/         # Context providers
│   │   └── LayoutContent.tsx
│   ├── redux/            # Redux store
│   │   ├── slices/       # Redux slices
│   │   │   └── authSlice.ts
│   │   ├── hooks.ts      # Typed hooks
│   │   ├── Provider.tsx  # Redux provider
│   │   └── store.ts      # Store config
│   └── types/            # TypeScript types
│       ├── appointment.ts
│       ├── auth.ts
│       ├── profile.ts
│       └── test-result.ts
├── tests/                # Test files
│   ├── components/
│   ├── modules/
│   └── redux/
├── .env.local            # Environment variables (not committed)
├── jest.config.js        # Jest configuration
├── next.config.ts        # Next.js configuration
├── tailwind.config.js    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** 1.22+

### Installation

1. **Clone and navigate:**
   ```bash
   git clone <repository-url>
   cd frontend-user
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API URLs
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

### Development
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run type-check       # TypeScript check
```

### Testing
```bash
npm run test             # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## 🔄 Development Workflow

### Commit Message Format
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add password reset
fix(profile): resolve avatar upload
docs: update README
test(appointment): add booking tests
```

## 🧪 Testing

See **[TEST_WRITING_GUIDE.md](./TEST_WRITING_GUIDE.md)** for detailed guidelines.

**Quick example:**
```typescript
import { render, screen } from '@testing-library/react';
import Dashboard from '@/components/shared/dashboard/Dashboard';

describe('Dashboard', () => {
  it('displays patient name', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });
});
```

## 🔐 Environment Variables

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.yourlab.com/v1
NEXT_PUBLIC_AUTH_SERVICE_URL=https://api.yourlab.com/auth
NEXT_PUBLIC_PATIENT_SERVICE_URL=https://api.yourlab.com/patient

# Security
NEXT_PUBLIC_SECRET=your-secret-key

# OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_SECRET=
```

**⚠️ Never commit `.env.local`!**

## 🚀 Deployment

### Docker Deployment

1. **Build Docker image:**
   ```bash
   docker build -t labuser-frontend .
   ```

2. **Run container:**
   ```bash
   docker run -p 3000:3000 --env-file .env.production labuser-frontend
   ```

### Dokploy Deployment

1. **Push to Git repository**
2. **In Dokploy dashboard:**
   - Create new application
   - Connect Git repo
   - Set environment variables
   - Deploy

### Vercel Deployment (Recommended)

```bash
npm install -g vercel
vercel --prod
```

## 📱 Mobile Support

- **iOS Safari** - Fully tested
- **Android Chrome** - Fully tested
- **Progressive Web App** - Installable on mobile

## 🔒 Security

- JWT token authentication
- Encrypted data transmission
- XSS protection
- CSRF protection
- Regular security audits

## 📞 Support

For issues or questions:
1. Check documentation
2. Search GitHub issues
3. Contact support team

---

**Built with ❤️ for Patients - FSA Team HCM CPL Java 09 Group 2**

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
