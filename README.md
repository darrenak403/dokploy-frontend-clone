# Laboratory Information System - Frontend

Modern microservices-based laboratory management system with separate admin and patient portals, built with Next.js 15, TypeScript, and modern web technologies.

## 📋 Overview

This monorepo contains two Next.js applications:

- **`frontend-admin`** - Admin dashboard for laboratory staff
- **`frontend-user`** - Patient portal for accessing test results

Both applications share similar tech stacks but serve different user roles with tailored features.

## 🏗 Architecture

```
dokploy-frontend/
├── frontend-admin/      # Admin dashboard (port 5173)
│   ├── User management
│   ├── Test ordering
│   ├── HL7 integration
│   ├── Warehouse management
│   └── Result management
│
└── frontend-user/       # Patient portal (port 3000)
    ├── Patient authentication
    ├── View test results
    ├── Book appointments
    ├── Medical records
    └── Health dashboard
```

## ✨ Key Features

### Frontend Admin

- 👥 Complete user and role management
- 🏥 Patient record management
- 🧪 Test order creation and tracking
- 📊 HL7 message builder and sender
- 📦 Reagent and instrument warehouse
- 📈 Real-time monitoring dashboards
- 🔐 Advanced authentication & authorization

### Frontend User

- 🔐 Secure patient login
- 📋 Personal medical records
- 🧪 Test result viewing with PDF export
- 📅 Appointment scheduling
- 📊 Health trend visualization
- 🔔 Result notifications
- 📱 Mobile-optimized interface

## 🛠 Tech Stack

Both applications use:

- **Next.js 15.5** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Redux Toolkit** - State management
- **SWR** - Data fetching & caching
- **HeroUI** - Component library
- **Jest & React Testing Library** - Testing
- **Docker** - Containerization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+ or yarn 1.22+
- Docker (optional, for deployment)

### Install All Dependencies

```bash
# Install admin dependencies
cd frontend-admin
npm install

# Install user dependencies
cd ../frontend-user
npm install
```

### Run Development Servers

**Terminal 1 - Admin Dashboard:**

```bash
cd frontend-admin
npm run dev
# Access at http://localhost:5173
```

**Terminal 2 - Patient Portal:**

```bash
cd frontend-user
npm run dev
# Access at http://localhost:3000
```

## 📁 Project Structure

```
dokploy-frontend/
├── frontend-admin/
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── hook/          # Custom hooks
│   │   ├── redux/         # State management
│   │   ├── types/         # TypeScript types
│   │   └── modules/       # Business logic
│   ├── tests/             # Test files
│   ├── Dockerfile         # Docker config
│   └── README.md          # Detailed admin docs
│
├── frontend-user/
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # React components
│   │   ├── hook/          # Custom hooks
│   │   ├── redux/         # State management
│   │   └── types/         # TypeScript types
│   ├── tests/             # Test files
│   ├── Dockerfile         # Docker config
│   └── README.md          # Detailed user docs
│
└── README.md              # This file
```

## 🧪 Testing

Run tests for both applications:

```bash
# Admin tests
cd frontend-admin
npm run test:coverage

# User tests
cd frontend-user
npm run test:coverage
```

**Coverage Requirements:** 70%+ for all metrics

## 🔐 Environment Setup

### Frontend Admin (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:6789/v1/api
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8081/iam
NEXT_PUBLIC_PATIENT_SERVICE_URL=http://localhost:8082
NEXT_PUBLIC_SECRET=your-admin-secret
PORT=5173
```

### Frontend User (.env.local)

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourlab.com/v1
NEXT_PUBLIC_AUTH_SERVICE_URL=https://api.yourlab.com/auth
NEXT_PUBLIC_PATIENT_SERVICE_URL=https://api.yourlab.com/patient
NEXT_PUBLIC_SECRET=your-user-secret
```

## 🐳 Docker Deployment

### Build Images

```bash
# Build admin
cd frontend-admin
docker build -t labadmin-frontend .

# Build user
cd frontend-user
docker build -t labuser-frontend .
```

### Run Containers

```bash
# Run admin
docker run -p 5173:5173 --env-file .env.production labadmin-frontend

# Run user
docker run -p 3000:3000 --env-file .env.production labuser-frontend
```

### Docker Compose

```yaml
version: '3.8'
services:
  frontend-admin:
    build: ./frontend-admin
    ports:
      - '5173:5173'
    environment:
      - NEXT_PUBLIC_API_BASE_URL=${ADMIN_API_URL}
    networks:
      - lab-network

  frontend-user:
    build: ./frontend-user
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_BASE_URL=${USER_API_URL}
    networks:
      - lab-network

networks:
  lab-network:
```

Run: `docker-compose up -d`

## 🚀 Deployment Options

### 1. Dokploy (Recommended for Self-Hosting)

- Push code to Git
- Create apps in Dokploy dashboard
- Configure environment variables
- Deploy with one click

### 2. Vercel (Recommended for Quick Deploy)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy admin
cd frontend-admin
vercel --prod

# Deploy user
cd frontend-user
vercel --prod
```

### 3. AWS/Azure/GCP

- Build Docker images
- Push to container registry
- Deploy to Kubernetes/ECS/App Service

## 📊 Performance

- **Lighthouse Score:** 90+ (all metrics)
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Bundle Size:** Optimized with code splitting

## 🔒 Security

- JWT authentication with refresh tokens
- XSS and CSRF protection
- Encrypted data transmission (HTTPS)
- Regular security audits
- HIPAA-compliant data handling

## 🤝 Contributing

### Branch Naming

```
feature/   - New features
fix/       - Bug fixes
docs/      - Documentation
test/      - Tests
refactor/  - Code refactoring
```

### Commit Convention

```
feat(admin): add user management
fix(user): resolve login issue
docs: update deployment guide
test(admin): add warehouse tests
```

### Development Workflow

1. Create feature branch
2. Make changes with tests
3. Run `npm run validate`
4. Create pull request
5. Code review & merge

## 📚 Documentation

- [Admin Documentation](./frontend-admin/README.md)
- [User Documentation](./frontend-user/README.md)
- [Testing Guide](./frontend-admin/TEST_WRITING_GUIDE.md)

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Kill process on port 3000
npx kill-port 3000
```

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Tests Fail

```bash
# Clear Jest cache
npm run test -- --clearCache
npm run test
```

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/datnguyencoder/dokploy-frontend/issues)
- **Email:** support@yourlab.com
- **Docs:** [Documentation Site](https://docs.yourlab.com)

## 👥 Team

**FSA Team - HCM CPL Java 09 Group 2**

- Frontend Lead: Team Member
- Backend Integration: Team Member
- Testing: Team Member
- DevOps: Team Member

## 📄 License

This project is proprietary and confidential.

---

**Built with ❤️ for Healthcare Innovation**

## 🗺 Roadmap

- [ ] Mobile apps (React Native)
- [ ] Real-time chat support
- [ ] AI-powered result interpretation
- [ ] Integration with more LIS systems
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Last Updated:** December 2025
