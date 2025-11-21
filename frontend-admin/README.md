# Frontend Admin - Laboratory Information System

Modern Next.js 15 admin dashboard for managing laboratory operations, built with TypeScript, Redux, and HeroUI.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## ✨ Features

- 🔐 **Authentication & Authorization** - Secure login/signup with JWT
- 👥 **User Management** - Create, update, view users and roles
- 🏥 **Patient Management** - Complete patient records system
- 🧪 **Test Orders & Results** - Laboratory test ordering and result tracking
- 📊 **HL7 Integration** - HL7 message builder and sender
- 📦 **Warehouse Management** - Reagent and instrument tracking
- 🌓 **Dark Mode Support** - Full dark/light theme switching
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with HeroUI component library
- 📈 **Redux State Management** - Centralized state with persistence
- 🧪 **High Test Coverage** - 83%+ coverage with Jest & React Testing Library

## 🛠 Tech Stack

### Core

- **Next.js 15.5** - React framework with App Router
- **React 19** - Latest React with Turbopack
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

### State & Data

- **Redux Toolkit** - State management
- **Redux Persist** - State persistence
- **SWR** - Data fetching and caching
- **Axios** - HTTP client

### UI & Design

- **HeroUI** - Component library
- **Framer Motion** - Animations
- **GSAP** - Advanced animations
- **Three.js** - 3D graphics
- **next-themes** - Theme management

### Forms & Validation

- **Formik** - Form management
- **Yup** - Schema validation

### Testing & Quality

- **Jest 30** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **Commitlint** - Commit message validation

### Utilities

- **dayjs** - Date manipulation
- **crypto-js** - Encryption
- **pako** - Compression (HL7)
- **react-hot-toast** - Notifications
- **SweetAlert2** - Modal dialogs

## 📁 Project Structure

```
frontend-admin/
├── .husky/                 # Git hooks (pre-commit, pre-push, commit-msg)
├── public/                 # Static assets
│   ├── fonts/
│   ├── images/
│   └── videos/
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/       # Auth routes (signin, signup)
│   │   ├── (service)/    # Service routes (protected)
│   │   ├── (user)/       # User routes (profile, records)
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── providers.tsx # Client-side providers
│   ├── components/        # React components
│   │   ├── modules/      # Complex feature components
│   │   │   ├── Modal/    # All modal components
│   │   │   └── SwithTheme/ # Theme switcher
│   │   ├── shared/       # Shared/reusable components
│   │   │   ├── account/
│   │   │   ├── auth/
│   │   │   ├── hl7/
│   │   │   ├── home/
│   │   │   ├── layout/
│   │   │   ├── patient/
│   │   │   ├── profile/
│   │   │   ├── regents/
│   │   │   ├── test-order/
│   │   │   ├── test-result/
│   │   │   └── warehouse/
│   │   └── styled/       # Styled components
│   ├── hook/             # Custom React hooks
│   │   └── singleton/    # Singleton hooks (SWR, Disclosures)
│   ├── libs/             # Library wrappers
│   │   ├── fetcher.ts    # SWR fetcher
│   │   └── ProtectedRoute.tsx # Auth guard
│   ├── modules/          # Business logic & helpers
│   │   ├── CropImage/
│   │   ├── day/          # Date utilities
│   │   ├── encrypt/      # Encryption helpers
│   │   ├── hl7/          # HL7 message handling
│   │   ├── patient/      # Patient helpers
│   │   ├── profile/      # Profile helpers
│   │   ├── regent/       # Regent helpers
│   │   ├── test-order/   # Test order helpers
│   │   ├── test-result/  # Test result helpers
│   │   ├── user/         # User helpers
│   │   └── wareHouse/    # Warehouse helpers
│   ├── provider/         # Context providers
│   │   └── LayoutContent.tsx
│   ├── redux/            # Redux store
│   │   ├── slices/       # Redux slices
│   │   │   └── authSlice.ts
│   │   ├── hooks.ts      # Typed Redux hooks
│   │   ├── Provider.tsx  # Redux provider
│   │   └── store.ts      # Store configuration
│   └── types/            # TypeScript types
│       ├── auth.ts
│       ├── hashPassword.ts
│       ├── hl7/
│       ├── patient/
│       ├── profile/
│       ├── regent/
│       ├── roles/
│       ├── test-order/
│       ├── test-result/
│       └── wareHouse/
├── tests/                # Test files (mirrors src/)
│   ├── app/
│   ├── components/
│   ├── modules/
│   ├── redux/
│   └── types/
├── .eslintrc.mjs         # ESLint configuration
├── .prettierrc           # Prettier configuration
├── .prettierignore       # Prettier ignore patterns
├── commitlint.config.js  # Commit message rules
├── jest.config.js        # Jest configuration
├── jest.setup.js         # Jest setup
├── next.config.ts        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── TEST_WRITING_GUIDE.md # Testing guidelines (Vietnamese)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** 1.22+
- **Git** for version control

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd frontend-admin
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 📜 Available Scripts

### Development

```bash
npm run dev              # Start development server on port 5173
npm run build            # Build for production with Turbopack
npm run start            # Start production server
npm run clean            # Remove build artifacts and caches
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # TypeScript type checking
```

### Testing

```bash
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run test:ui          # Run tests with verbose output
```

### Build Analysis

```bash
npm run build:analyze    # Build and analyze bundle size
```

### Validation

```bash
npm run validate         # Run all checks (format, lint, type-check, test, build)
```

## 🔄 Development Workflow

### 1. Before Starting Work

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. During Development

- Write code following TypeScript best practices
- Write tests for new features (maintain 70%+ coverage)
- Commit frequently with meaningful messages

### 3. Before Committing

**Automatic checks via Husky pre-commit hook:**

- ✅ ESLint fixes staged files
- ✅ Prettier formats staged files

**Manual validation (recommended):**

```bash
npm run validate
```

### 4. Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

Examples:
feat(auth): add login functionality
fix(patient): resolve data validation issue
docs: update README with setup instructions
test(user): add tests for user creation
refactor(redux): simplify auth slice logic
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Adding/updating tests
- `build` - Build system changes
- `ci` - CI configuration
- `chore` - Other changes

**Commitlint will enforce this format automatically!**

### 5. Before Pushing

**Automatic checks via Husky pre-push hook:**

- ✅ ESLint check passes
- ✅ All tests pass with coverage
- ✅ Build succeeds

### 6. Creating Pull Request

Use the PR template to fill in:

- Description of changes
- Related issues
- Type of change
- Testing checklist
- Code quality checklist
- Screenshots (for UI changes)

## 🧪 Testing

### Test Structure

```
tests/                    # Mirrors src/ structure
├── components/          # Component tests
├── modules/            # Business logic tests
├── redux/              # Redux tests
└── types/              # Type validation tests
```

### Writing Tests

See **[TEST_WRITING_GUIDE.md](./TEST_WRITING_GUIDE.md)** (Vietnamese) for detailed guidelines.

**Quick example:**

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Coverage Requirements

- **Minimum threshold: 70%** for all metrics
- Current coverage: **83%+ statements**
- Coverage enforced by Jest configuration

```bash
npm run test:coverage
# View detailed report: open coverage/lcov-report/index.html
```

## 🎨 Code Quality

### ESLint

- Configuration: `eslint.config.mjs`
- Extends: `next/core-web-vitals`, `next/typescript`
- Max warnings: **0** (enforced in CI and pre-commit)

### Prettier

- Configuration: `.prettierrc`
- Plugins: Tailwind CSS, Import Sorting
- Auto-formats on commit via lint-staged

### Import Ordering

Imports are automatically sorted in this order:

1. React
2. Next.js
3. Third-party packages
4. `@/types/*`
5. `@/libs/*`
6. `@/redux/*`
7. `@/hook/*`
8. `@/modules/*`
9. `@/components/*`
10. `@/provider/*`
11. Relative imports

## 🔐 Environment Variables

Create `.env.local` with these variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:6789/v1/api
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8081/iam
NEXT_PUBLIC_PATIENT_SERVICE_URL=http://localhost:8082

# Security
NEXT_PUBLIC_SECRET=your-secret-key-here

# OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_SECRET=

# Server Port
PORT=5173
```

**⚠️ Never commit `.env.local` to version control!**

## 🤝 Contributing

### Branch Naming

```
feature/   - New features
fix/       - Bug fixes
docs/      - Documentation
refactor/  - Code refactoring
test/      - Test additions/updates
chore/     - Maintenance tasks
```

### Pull Request Process

1. Update tests and documentation
2. Ensure all checks pass (`npm run validate`)
3. Fill out PR template completely
4. Request review from team members
5. Address review feedback
6. Merge after approval

### Code Review Checklist

- [ ] Code logic is correct and understandable
- [ ] No code smells or anti-patterns
- [ ] Test coverage is adequate
- [ ] No security issues
- [ ] Performance is not negatively impacted
- [ ] UI changes reviewed (screenshots provided)
- [ ] Commit messages follow conventions

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## 📞 Support

For questions or issues:

1. Check existing documentation
2. Search closed issues on GitHub
3. Create a new issue with detailed description
4. Contact the development team

---

**Built with ❤️ by FSA Team - HCM CPL Java 09 Group 2**
