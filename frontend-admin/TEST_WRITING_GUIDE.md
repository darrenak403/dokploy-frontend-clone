# Universal Testing Implementation Guide

## Hướng dẫn Triển khai Testing cho Mọi Dự án React/Next.js

> **Mục đích:** Tài liệu này cung cấp quy trình hoàn chỉnh từ ZERO đến PRODUCTION-READY testing infrastructure, có thể áp dụng cho bất kỳ dự án React/Next.js nào.

---

## 📚 Table of Contents

1. [Phase 0: Pre-requisites Check](#phase-0-pre-requisites-check)
2. [Phase 1: Install Testing Dependencies](#phase-1-install-testing-dependencies)
3. [Phase 2: Configure Jest](#phase-2-configure-jest)
4. [Phase 3: Setup Global Test Environment](#phase-3-setup-global-test-environment)
5. [Phase 4: Create Test Directory Structure](#phase-4-create-test-directory-structure)
6. [Phase 4.5: Migrate Existing Tests](#phase-45-migrate-existing-tests-if-applicable) ⭐ **NEW**
7. [Phase 5: Create Testing Standards Document](#phase-5-create-testing-standards-document)
8. [Phase 6: Setup NPM Scripts](#phase-6-setup-npm-scripts)
9. [Phase 7: Implement Testing Workflow](#phase-7-implement-testing-workflow)
10. [Best Practices & Common Patterns](#best-practices--common-patterns)
11. [Real-World Examples](#real-world-testing-examples)
12. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## Phase 0: Pre-requisites Check

### ✅ Checklist trước khi bắt đầu

**1. Kiểm tra môi trường:**

```bash
# Verify Node.js version (yêu cầu >= 18.x cho Next.js 14+)
node --version

# Verify npm/yarn/pnpm
npm --version
```

**2. Phân tích cấu trúc project:**

```bash
# Xem cấu trúc thư mục source code
ls -la src/

# Kiểm tra các thư mục chính
# Expected structure:
# src/
#   ├── app/ hoặc pages/        (Next.js routing)
#   ├── components/              (React components)
#   ├── modules/ hoặc utils/     (Business logic, helpers)
#   ├── redux/ hoặc store/       (State management - optional)
#   ├── types/                   (TypeScript types)
#   └── libs/ hoặc services/     (API calls, external services)
```

**3. Xác định framework & dependencies:**

```bash
# Đọc package.json để xác định:
cat package.json | grep -A 20 '"dependencies"'

# Ghi chú các thư viện quan trọng cần mock:
# - Framework: next, react-router-dom
# - State: @reduxjs/toolkit, zustand, jotai
# - Data fetching: swr, react-query, axios
# - UI Libraries: @heroui/react, @mui/material, chakra-ui
# - Animation: framer-motion, gsap
# - Forms: formik, react-hook-form
# - Validation: yup, zod
```

**4. Kiểm tra TypeScript configuration:**

```bash
# Đọc tsconfig.json để lấy path aliases
cat tsconfig.json | grep -A 10 '"paths"'

# Thường thấy: "@/*": ["./src/*"]
# Cần đồng bộ alias này vào jest.config.js sau này
```

**5. Document hiện trạng:**

Tạo file `TESTING_SETUP.md` để ghi lại:

```markdown
# Testing Setup Notes

## Project Info

- Framework: Next.js 15.x / React 19.x
- TypeScript: Yes/No
- State Management: Redux Toolkit
- Data Fetching: SWR
- UI Library: HeroUI
- Path Alias: @/_ → src/_

## Dependencies to Mock

- [ ] next/navigation (useRouter, usePathname, useSearchParams)
- [ ] react-redux (useSelector, useDispatch)
- [ ] swr (default export)
- [ ] framer-motion (motion components)
- [ ] @heroui/react (complex components like Dropdown, Avatar)
- [ ] Custom hooks in src/hook/

## Coverage Goals

- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%
```

---

## Phase 1: Install Testing Dependencies

### 📦 Core Testing Libraries

**Bước 1.1: Install core dependencies**

```bash
# For Next.js projects
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# For TypeScript projects, add type definitions
npm install --save-dev @types/jest

# For Next.js, use next/jest preset (already includes ts-jest)
# No need to install ts-jest separately
```

**Bước 1.2: Verify installation**

```bash
# Check installed versions
npm list jest @testing-library/react @testing-library/jest-dom

# Expected output (versions may vary):
# ├── jest@30.2.0
# ├── @testing-library/react@16.3.0
# └── @testing-library/jest-dom@6.9.1
```

**Bước 1.3: Required dependencies checklist**

| Package                       | Version | Purpose                           | Required For           |
| ----------------------------- | ------- | --------------------------------- | ---------------------- |
| `jest`                        | ^30.0.0 | Test runner & framework           | All projects           |
| `@testing-library/react`      | ^16.0.0 | React component testing utilities | React/Next.js          |
| `@testing-library/jest-dom`   | ^6.0.0  | Custom DOM matchers               | All projects           |
| `@testing-library/user-event` | ^14.0.0 | User interaction simulation       | Interactive components |
| `jest-environment-jsdom`      | ^30.0.0 | Browser-like environment          | React/Next.js          |
| `@types/jest`                 | ^30.0.0 | TypeScript type definitions       | TypeScript projects    |

**Bước 1.4: Optional but recommended**

```bash
# For better test coverage visualization
npm install --save-dev @jest/types

# For mocking specific modules (usually not needed, jest.mock() is sufficient)
# npm install --save-dev jest-mock
```

---

## Phase 2: Configure Jest

### ⚙️ Create jest.config.js

**Bước 2.1: For Next.js projects**

Create `jest.config.js` in project root:

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

// Add custom config to be passed to Jest
const customJestConfig = {
  // Setup file to run before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Test environment (jsdom for React components)
  testEnvironment: "jest-environment-jsdom",

  // Module name mapper for path aliases (must match tsconfig.json paths)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Add more aliases if needed:
    // "^@components/(.*)$": "<rootDir>/src/components/$1",
    // "^@modules/(.*)$": "<rootDir>/src/modules/$1",
  },

  // Coverage collection settings
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts", // Exclude type definitions
    "!src/**/*.stories.{js,jsx,ts,tsx}", // Exclude Storybook stories
    "!src/**/__tests__/**", // Exclude test directories
    "!src/**/__mocks__/**", // Exclude mock directories
    "!src/**/types/**", // Exclude pure type files (optional)
  ],

  // Minimum coverage thresholds (adjust based on project maturity)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Test file location patterns
  testMatch: ["<rootDir>/tests/**/*.{spec,test}.{js,jsx,ts,tsx}"],

  // Root directories for test discovery
  roots: ["<rootDir>/tests"],

  // Transform files (next/jest handles this automatically)
  // transform: { ... } // Not needed with next/jest preset
};

// Export async config to ensure Next.js config is loaded
module.exports = createJestConfig(customJestConfig);
```

**Bước 2.2: For React (non-Next.js) projects**

Create `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Mock CSS modules
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Mock static assets
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react",
        },
      },
    ],
  },

  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  testMatch: ["<rootDir>/tests/**/*.{spec,test}.{js,jsx,ts,tsx}"],
  roots: ["<rootDir>/tests"],
};
```

**Bước 2.3: Verify path aliases match tsconfig.json**

```bash
# Compare jest.config.js moduleNameMapper with tsconfig.json paths
cat tsconfig.json | grep -A 5 '"paths"'
cat jest.config.js | grep -A 5 'moduleNameMapper'

# Example:
# tsconfig.json:  "@/*": ["./src/*"]
# jest.config.js: "^@/(.*)$": "<rootDir>/src/$1"
#                  ✅ MATCH!
```

**Bước 2.4: Create mock files (for non-Next.js projects)**

```bash
# Create __mocks__ directory
mkdir -p __mocks__

# Create file mock for static assets
cat > __mocks__/fileMock.js << 'EOF'
module.exports = "test-file-stub";
EOF
```

---

## Phase 3: Setup Global Test Environment

### 🌍 Create jest.setup.js

**Bước 3.1: Create jest.setup.js in project root**

```javascript
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// ==========================================
// 1. MOCK ENVIRONMENT VARIABLES
// ==========================================
// Set any environment variables needed for tests
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000/api";
process.env.NEXT_PUBLIC_SECRET = "test-secret-key-for-encryption";
// Add more as needed based on your .env file

// ==========================================
// 2. POLYFILLS FOR NODE ENVIRONMENT
// ==========================================
// Add TextEncoder and TextDecoder to global scope
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock crypto.subtle for Web Crypto API (for encryption/hashing tests)
const crypto = require("crypto");
if (typeof global.crypto === "undefined") {
  global.crypto = crypto.webcrypto;
} else if (!global.crypto.subtle) {
  global.crypto.subtle = crypto.webcrypto.subtle;
}

// ==========================================
// 3. MOCK NEXT.JS ROUTING (for Next.js projects)
// ==========================================
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock next/router for Pages Router (if using Next.js 12 or earlier)
// jest.mock("next/router", () => ({
//   useRouter: () => ({
//     push: jest.fn(),
//     replace: jest.fn(),
//     prefetch: jest.fn(),
//     back: jest.fn(),
//     pathname: "/",
//     query: {},
//     asPath: "/",
//   }),
// }));

// ==========================================
// 4. MOCK REACT ROUTER (for React non-Next.js projects)
// ==========================================
// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useNavigate: () => jest.fn(),
//   useLocation: () => ({
//     pathname: "/",
//     search: "",
//     hash: "",
//     state: null,
//   }),
//   useParams: () => ({}),
// }));

// ==========================================
// 5. GLOBAL TEST UTILITIES (optional)
// ==========================================
// Add global test helpers if needed
global.waitForAsync = (ms = 0) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// 6. SUPPRESS CONSOLE WARNINGS (optional)
// ==========================================
// Suppress specific console warnings from third-party libraries
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Filter out known warnings that don't affect tests
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") ||
        args[0].includes("Not implemented: HTMLFormElement.prototype.submit"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    // Filter out UI library warnings
    if (
      typeof args[0] === "string" &&
      (args[0].includes("aria-label") ||
        args[0].includes("deprecated") ||
        args[0].includes("componentWillReceiveProps"))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
```

**Bước 3.2: Customize based on project dependencies**

Add framework-specific mocks based on Phase 0 analysis:

```javascript
// ==========================================
// 7. MOCK COMMON LIBRARIES (add as needed)
// ==========================================

// Mock window.matchMedia (for responsive components)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver (for lazy loading)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver (for responsive components)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
```

---

## Phase 4: Create Test Directory Structure

### 📁 Setup Test Folder Hierarchy

**Bước 4.1: Create tests/ directory mirroring src/**

```bash
# Navigate to project root
cd /path/to/your/project

# Create tests directory structure matching src/
mkdir -p tests/{components,modules,redux,types,libs,hooks}

# If you have nested folders in src/, mirror them:
# Example for src/components/shared/auth/SignIn.tsx:
mkdir -p tests/components/shared/auth

# Example for src/modules/user/helpers.ts:
mkdir -p tests/modules/user
```

**Bước 4.2: Document naming convention**

Create `tests/README.md`:

````markdown
# Test Directory Structure

## Naming Convention

### File Naming

- Source file: `src/components/Button.tsx`
- Test file: `tests/components/Button.test.tsx`

- Source file: `src/modules/user/helpers.ts`
- Test file: `tests/modules/user/helpers.test.ts`

**Pattern:** `[filename].test.{ts,tsx}`

### Directory Mirroring

Tests MUST mirror the exact folder structure of `src/`:

\`\`\`
src/ → tests/
├── app/ → tests/app/
│ └── page.tsx → tests/app/page.test.tsx
├── components/ → tests/components/
│ ├── shared/ → tests/components/shared/
│ │ ├── Button.tsx → tests/components/shared/Button.test.tsx
│ │ └── Input.tsx → tests/components/shared/Input.test.tsx
│ └── modules/ → tests/components/modules/
│ └── Header.tsx → tests/components/modules/Header.test.tsx
├── modules/ → tests/modules/
│ ├── auth/ → tests/modules/auth/
│ │ └── validation.ts → tests/modules/auth/validation.test.ts
│ └── user/ → tests/modules/user/
│ └── helpers.ts → tests/modules/user/helpers.test.ts
├── redux/ → tests/redux/
│ ├── store.ts → tests/redux/store.test.ts
│ └── slices/ → tests/redux/slices/
│ └── authSlice.ts → tests/redux/slices/authSlice.test.ts
├── types/ → tests/types/
│ └── user.ts → tests/types/user.test.ts
└── libs/ → tests/libs/
└── fetcher.ts → tests/libs/fetcher.test.ts
\`\`\`

## Import Path Rules

### ✅ ALWAYS use path aliases:

\`\`\`typescript
import { Button } from "@/components/shared/Button";
import { formatDate } from "@/modules/utils/date";
\`\`\`

### ❌ NEVER use relative paths:

\`\`\`typescript
import { Button } from "../../../src/components/shared/Button"; // ❌
import { formatDate } from "../../modules/utils/date"; // ❌
\`\`\`

## What to Test

### Components (`tests/components/`)

- Rendering with different props
- User interactions (clicks, typing, form submissions)
- Conditional rendering
- Error states
- Loading states

### Modules (`tests/modules/`)

- Pure functions (input → output)
- Validation schemas (Yup, Zod)
- Business logic helpers
- Data transformations
- Utility functions

### Redux (`tests/redux/`)

- Store initialization
- Reducers (state transitions)
- Selectors
- Async thunks (with mocked APIs)

### Types (`tests/types/`)

- Type guards
- Type utilities
- Runtime type validation

### Libs/Services (`tests/libs/`)

- API client functions (with mocked fetch/axios)
- External service integrations
- Authentication helpers
  \`\`\`

**Bước 4.3: Create template files**

```bash
# Create a template for component tests
cat > tests/COMPONENT_TEMPLATE.test.tsx << 'EOF'
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ComponentName } from "@/components/path/ComponentName";

// Mock dependencies if needed
// jest.mock("next/navigation");
// jest.mock("@/redux/hooks");

describe("ComponentName", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<ComponentName />);
      expect(screen.getByText("Expected Text")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("should handle user action", async () => {
      render(<ComponentName />);
      const button = screen.getByRole("button", { name: /submit/i });

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText("Success")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle null props gracefully", () => {
      render(<ComponentName data={null} />);
      expect(screen.queryByText("Error")).not.toBeInTheDocument();
    });
  });
});
EOF

# Create a template for module tests
cat > tests/MODULE_TEMPLATE.test.ts << 'EOF'
import { functionName } from "@/modules/path/moduleName";

describe("functionName", () => {
  it("should return expected output for valid input", () => {
    const result = functionName("valid input");
    expect(result).toBe("expected output");
  });

  it("should handle edge cases", () => {
    expect(functionName("")).toBe("");
    expect(functionName(null)).toBe(null);
    expect(functionName(undefined)).toBe(undefined);
  });

  it("should throw error for invalid input", () => {
    expect(() => functionName("invalid")).toThrow("Error message");
  });
});
EOF
```
````

---

## Phase 4.5: Migrate Existing Tests (If Applicable)

### 🔄 Reorganize Tests to Centralized Structure

**When to use this phase:**

- ✅ You have existing tests scattered in `src/**/__tests__/` folders
- ✅ You have tests co-located with source files
- ✅ You want to standardize test location to centralized `tests/` folder
- ❌ Skip if starting fresh project with no existing tests

---

### Bước 4.5.1: Audit Existing Test Files

**Find all test files in the project:**

```bash
# Navigate to project root
cd /path/to/your/project

# Find all test files (*.test.*, *.spec.*, __tests__ folders)
find src -type f \( -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" \) > test-files-to-migrate.txt

# Find all __tests__ directories
find src -type d -name "__tests__" >> test-files-to-migrate.txt

# Review the list
cat test-files-to-migrate.txt
```

**Example output:**

```
src/components/Button/__tests__/Button.test.tsx
src/components/Form/Form.test.tsx
src/utils/__tests__/helpers.test.ts
src/pages/dashboard.test.tsx
```

**Document current state:**

```bash
# Count total test files
echo "Total test files to migrate: $(find src -type f \( -name "*.test.*" -o -name "*.spec.*" \) | wc -l)"

# Count by type
echo "Components: $(find src/components -type f \( -name "*.test.*" -o -name "*.spec.*" \) | wc -l)"
echo "Utils/Modules: $(find src/utils -type f \( -name "*.test.*" -o -name "*.spec.*" \) | wc -l)"
echo "Pages: $(find src/pages -type f \( -name "*.test.*" -o -name "*.spec.*" \) | wc -l)"
```

---

### Bước 4.5.2: Create Migration Script

**Create `migrate-tests.js` in project root:**

```javascript
#!/usr/bin/env node
/**
 * Test Migration Script
 *
 * Purpose: Move all test files from src/ to centralized tests/ folder
 *
 * Features:
 * - Finds all *.test.*, *.spec.* files and __tests__ folders
 * - Maintains folder structure (src/components/X → tests/components/X)
 * - Updates import paths (../../ → @/)
 * - Removes old __tests__ folders after migration
 * - Creates backup before migration
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const SRC_DIR = "src";
const TESTS_DIR = "tests";
const BACKUP_DIR = "tests-backup";
const DRY_RUN = process.argv.includes("--dry-run");

// Test file patterns
const TEST_PATTERNS = [/\.test\.(ts|tsx|js|jsx)$/, /\.spec\.(ts|tsx|js|jsx)$/];

// Logging utilities
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
};

// Find all test files
function findTestFiles(dir) {
  const results = [];

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "__tests__") {
          // Found __tests__ folder, get all files inside
          const testFiles = fs
            .readdirSync(fullPath)
            .filter((file) =>
              TEST_PATTERNS.some((pattern) => pattern.test(file))
            )
            .map((file) => path.join(fullPath, file));
          results.push(...testFiles);
        } else if (entry.name !== "node_modules" && entry.name !== ".next") {
          traverse(fullPath);
        }
      } else if (entry.isFile()) {
        // Check if file matches test pattern
        if (TEST_PATTERNS.some((pattern) => pattern.test(entry.name))) {
          results.push(fullPath);
        }
      }
    }
  }

  traverse(dir);
  return results;
}

// Calculate destination path
function getDestinationPath(sourcePath) {
  // Remove 'src/' prefix
  let relativePath = sourcePath.replace(new RegExp(`^${SRC_DIR}/`), "");

  // Remove __tests__ folder from path
  relativePath = relativePath.replace("/__tests__/", "/");

  // Construct destination path
  return path.join(TESTS_DIR, relativePath);
}

// Update import paths in file content
function updateImportPaths(content, sourceFile, destFile) {
  let updatedContent = content;

  // Convert relative imports to @/ alias
  // Pattern: from '../../../src/components/Button'
  // Becomes: from '@/components/Button'

  const relativeImportRegex = /from\s+['"](\.\.[/\\])+/g;

  updatedContent = updatedContent.replace(
    /from\s+['"](\.\.[/\\].+?)['"];?/g,
    (match, importPath) => {
      // Calculate absolute path from source file
      const sourceDir = path.dirname(sourceFile);
      const absolutePath = path.resolve(sourceDir, importPath);

      // Check if it points to src/
      if (absolutePath.includes(path.join(process.cwd(), SRC_DIR))) {
        const srcRelative = path.relative(
          path.join(process.cwd(), SRC_DIR),
          absolutePath
        );

        // Convert to @/ alias
        const aliasPath = "@/" + srcRelative.replace(/\\/g, "/");
        return `from '${aliasPath}'`;
      }

      return match;
    }
  );

  return updatedContent;
}

// Migrate a single test file
function migrateTestFile(sourceFile) {
  const destFile = getDestinationPath(sourceFile);

  log.info(`Migrating: ${sourceFile} → ${destFile}`);

  if (DRY_RUN) {
    return { success: true, skipped: true };
  }

  try {
    // Create destination directory
    const destDir = path.dirname(destFile);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Check if destination already exists
    if (fs.existsSync(destFile)) {
      log.warning(`Destination already exists, skipping: ${destFile}`);
      return { success: false, skipped: true };
    }

    // Read source file
    const content = fs.readFileSync(sourceFile, "utf8");

    // Update import paths
    const updatedContent = updateImportPaths(content, sourceFile, destFile);

    // Write to destination
    fs.writeFileSync(destFile, updatedContent, "utf8");

    log.success(`Migrated: ${path.basename(sourceFile)}`);

    return { success: true, sourceFile, destFile };
  } catch (error) {
    log.error(`Failed to migrate ${sourceFile}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Remove old test files and empty __tests__ folders
function cleanup(migratedFiles) {
  log.info("Starting cleanup...");

  if (DRY_RUN) {
    log.info(
      "DRY RUN: Would delete migrated files and empty __tests__ folders"
    );
    return;
  }

  // Delete migrated source files
  for (const { sourceFile } of migratedFiles) {
    if (fs.existsSync(sourceFile)) {
      fs.unlinkSync(sourceFile);
      log.success(`Deleted: ${sourceFile}`);
    }
  }

  // Find and remove empty __tests__ folders
  function removeEmptyDirs(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && entry.name !== "node_modules") {
        if (entry.name === "__tests__") {
          const contents = fs.readdirSync(fullPath);
          if (contents.length === 0) {
            fs.rmdirSync(fullPath);
            log.success(`Removed empty: ${fullPath}`);
          }
        } else {
          removeEmptyDirs(fullPath);
        }
      }
    }
  }

  removeEmptyDirs(SRC_DIR);
}

// Create backup
function createBackup() {
  if (DRY_RUN) {
    log.info("DRY RUN: Would create backup");
    return;
  }

  log.info("Creating backup...");

  if (fs.existsSync(BACKUP_DIR)) {
    fs.rmSync(BACKUP_DIR, { recursive: true });
  }

  // Copy all test files to backup
  execSync(`mkdir -p ${BACKUP_DIR}`);
  execSync(
    `find ${SRC_DIR} -type f \\( -name "*.test.*" -o -name "*.spec.*" \\) -exec cp --parents {} ${BACKUP_DIR} \\; 2>/dev/null || true`
  );

  log.success("Backup created");
}

// Main execution
function main() {
  console.log("=".repeat(60));
  console.log("📦 Test Migration Script");
  console.log("=".repeat(60));

  if (DRY_RUN) {
    log.warning("Running in DRY RUN mode (no changes will be made)");
  }

  // Step 1: Find all test files
  log.info("Step 1: Finding test files...");
  const testFiles = findTestFiles(SRC_DIR);

  if (testFiles.length === 0) {
    log.warning("No test files found in src/");
    return;
  }

  log.info(`Found ${testFiles.length} test files`);

  // Step 2: Create backup
  log.info("Step 2: Creating backup...");
  createBackup();

  // Step 3: Migrate files
  log.info("Step 3: Migrating test files...");
  const results = testFiles.map(migrateTestFile);

  const successful = results.filter((r) => r.success && !r.skipped);
  const skipped = results.filter((r) => r.skipped);
  const failed = results.filter((r) => !r.success && !r.skipped);

  // Step 4: Cleanup
  if (successful.length > 0 && !DRY_RUN) {
    log.info("Step 4: Cleaning up old files...");
    cleanup(successful);
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 Migration Summary");
  console.log("=".repeat(60));
  console.log(`✅ Successfully migrated: ${successful.length}`);
  console.log(`⏭️  Skipped: ${skipped.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log("=".repeat(60));

  if (failed.length > 0) {
    console.log("\n⚠️  Some files failed to migrate. Check errors above.");
    process.exit(1);
  }

  if (!DRY_RUN) {
    console.log("\n✅ Migration complete!");
    console.log(`\n💾 Backup available at: ${BACKUP_DIR}/`);
    console.log("\n📝 Next steps:");
    console.log("   1. Run tests: npm test");
    console.log("   2. Verify coverage: npm run test:coverage");
    console.log(
      "   3. If everything works, delete backup: rm -rf tests-backup/"
    );
  }
}

// Run
main();
```

**Make script executable:**

```bash
chmod +x migrate-tests.js
```

---

### Bước 4.5.3: Run Migration (Dry Run First)

**Test the migration without making changes:**

```bash
# Dry run to see what will happen
node migrate-tests.js --dry-run

# Output example:
# ℹ️  DRY RUN mode (no changes will be made)
# ℹ️  Found 45 test files
# ℹ️  Would migrate: src/components/Button/__tests__/Button.test.tsx → tests/components/Button/Button.test.tsx
# ℹ️  Would migrate: src/utils/helpers.test.ts → tests/utils/helpers.test.ts
# ...
```

**Review the dry run output carefully:**

- [ ] Check destination paths are correct
- [ ] Verify no conflicts with existing files
- [ ] Ensure all test files are found

**Run actual migration:**

```bash
# Create git commit before migration (safety!)
git add .
git commit -m "Before test migration"

# Run migration
node migrate-tests.js

# Output:
# ✅ Migrated: Button.test.tsx
# ✅ Migrated: helpers.test.ts
# ...
# ✅ Successfully migrated: 45
# ⏭️  Skipped: 0
# ❌ Failed: 0
```

---

### Bước 4.5.4: Update Jest Configuration

**Update `jest.config.js` to only read from `tests/` folder:**

```javascript
// Before migration (reads from src/ and tests/)
module.exports = {
  testMatch: ["**/__tests__/**/*.{ts,tsx}", "**/*.{test,spec}.{ts,tsx}"],
  roots: ["<rootDir>/src", "<rootDir>/tests"], // ❌ Multiple roots
};

// After migration (only tests/ folder)
module.exports = {
  testMatch: ["<rootDir>/tests/**/*.{test,spec}.{ts,tsx}"],
  roots: ["<rootDir>/tests"], // ✅ Single root

  // Update coverage collection (still collect from src/)
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**", // No longer needed
  ],
};
```

**Update `package.json` scripts if needed:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",

    // Update if you had specific test paths
    "test:components": "jest tests/components",
    "test:utils": "jest tests/utils"
  }
}
```

---

### Bước 4.5.5: Verify Migration

**Run all tests to ensure they still work:**

```bash
# Clear Jest cache first
npm test -- --clearCache

# Run all tests
npm test

# Expected output:
# PASS  tests/components/Button/Button.test.tsx
# PASS  tests/utils/helpers.test.ts
# ...
# Tests:       45 passed, 45 total
# Time:        5.234 s
```

**Check coverage still works:**

```bash
npm run test:coverage

# Verify coverage report is generated
ls coverage/lcov-report/index.html

# Open coverage report
open coverage/lcov-report/index.html
```

**Verify import paths are correct:**

```bash
# Search for any remaining relative imports that should be @/
grep -r "from '\.\./\.\./\.\./src" tests/

# Should return no results
# If it does, those imports need manual fixing
```

---

### Bước 4.5.6: List All Migrated Test Files

**Generate complete list of test files:**

```bash
# List all test files with full paths
find tests -type f \( -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" \) | sort > tests-inventory.txt

# View the list
cat tests-inventory.txt

# Example output:
# tests/components/Button/Button.test.tsx
# tests/components/Form/Form.test.tsx
# tests/components/Input/Input.test.tsx
# tests/modules/auth/validation.test.ts
# tests/modules/utils/helpers.test.ts
# tests/pages/dashboard.test.tsx
# tests/redux/slices/authSlice.test.ts
```

**Create test inventory document:**

```bash
# Generate detailed inventory with line counts
cat > tests-inventory.md << 'EOF'
# Test Files Inventory

## Summary
- Total test files: $(find tests -type f \( -name "*.test.*" -o -name "*.spec.*" \) | wc -l)
- Components: $(find tests/components -type f \( -name "*.test.*" -o -name "*.spec.*" \) 2>/dev/null | wc -l)
- Modules: $(find tests/modules -type f \( -name "*.test.*" -o -name "*.spec.*" \) 2>/dev/null | wc -l)
- Pages: $(find tests/pages -type f \( -name "*.test.*" -o -name "*.spec.*" \) 2>/dev/null | wc -l)
- Redux: $(find tests/redux -type f \( -name "*.test.*" -o -name "*.spec.*" \) 2>/dev/null | wc -l)

## File List

$(find tests -type f \( -name "*.test.*" -o -name "*.spec.*" \) | sort | sed 's/^/- /')

## Migration Date
- Migrated on: $(date)
- Migration script: migrate-tests.js
- Backup location: tests-backup/

## Verification
- [ ] All tests pass: \`npm test\`
- [ ] Coverage works: \`npm run test:coverage\`
- [ ] No broken imports
- [ ] Jest config updated
- [ ] CI/CD still works
EOF

# Fill in the summary counts
node -e "
const fs = require('fs');
const { execSync } = require('child_process');

const content = fs.readFileSync('tests-inventory.md', 'utf8');
const updated = content
  .replace(/\\$\\(find[^)]+\\)/g, (match) => {
    try {
      return execSync(match.slice(2, -1), { encoding: 'utf8' }).trim();
    } catch {
      return '0';
    }
  })
  .replace(/\\$\\(date\\)/g, new Date().toISOString());

fs.writeFileSync('tests-inventory.md', updated);
"

cat tests-inventory.md
```

---

### Bước 4.5.7: Cleanup and Finalize

**If everything works, remove backup:**

```bash
# Verify tests work one more time
npm test

# If all good, remove backup
rm -rf tests-backup/

# Commit the migration
git add .
git commit -m "Migrate all tests to centralized tests/ folder

- Moved all *.test.*, *.spec.* files to tests/
- Removed __tests__ folders from src/
- Updated import paths to use @/ alias
- Updated Jest configuration
- All tests passing
- Coverage still works

Files migrated: 45"
```

**Update documentation:**

```bash
# Update README.md to document new test location
cat >> README.md << 'EOF'

## Testing

All tests are located in the `tests/` folder, mirroring the `src/` structure:

\`\`\`
tests/
├── components/     # Component tests
├── modules/        # Business logic tests
├── pages/          # Page tests
├── redux/          # Redux tests
└── utils/          # Utility tests
\`\`\`

Run tests:
\`\`\`bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # With coverage
\`\`\`
EOF
```

**Update `.gitignore` if needed:**

```bash
# Add to .gitignore
echo "tests-backup/" >> .gitignore
echo "test-files-to-migrate.txt" >> .gitignore
```

---

### Bước 4.5.8: Verify CI/CD Still Works

**If you have GitHub Actions or other CI:**

```bash
# Push changes to a branch first
git checkout -b migrate-tests
git push origin migrate-tests

# Create PR and check if CI passes
# Verify:
# - Tests run successfully in CI
# - Coverage reports are generated
# - No import errors
# - Build succeeds
```

**Update CI configuration if needed:**

```yaml
# .github/workflows/test.yml
# If your CI had specific test paths, update them:

# Before:
- run: npm test src/

# After:
- run: npm test tests/
```

---

### 🎯 Migration Checklist

Use this checklist to ensure complete migration:

**Pre-Migration:**

- [ ] Audit all existing test files
- [ ] Document current test count and locations
- [ ] Create git commit before migration
- [ ] Review migration script

**During Migration:**

- [ ] Run dry-run first
- [ ] Review dry-run output
- [ ] Run actual migration
- [ ] Backup created automatically

**Post-Migration:**

- [ ] Update `jest.config.js` (testMatch, roots)
- [ ] Update `package.json` scripts (if needed)
- [ ] Run `npm test -- --clearCache`
- [ ] All tests pass: `npm test`
- [ ] Coverage works: `npm run test:coverage`
- [ ] No broken imports: `grep -r "from '\.\./\.\./\.\./src" tests/`
- [ ] Generate test inventory: `tests-inventory.md`
- [ ] Update documentation (README.md)
- [ ] Update `.gitignore`
- [ ] CI/CD still works
- [ ] Commit changes
- [ ] Remove backup: `rm -rf tests-backup/`

**Verification:**

- [ ] Total test count matches (before vs after)
- [ ] All test files migrated
- [ ] All `__tests__` folders removed
- [ ] Import paths use `@/` alias
- [ ] Coverage percentage unchanged
- [ ] Build succeeds

---

## Phase 5: Create Testing Standards Document

### 📝 Establish Testing Guidelines

**Bước 5.1: Create TESTING_STANDARDS.md**

This section defines what and how to test. Save as `TESTING_STANDARDS.md`:

````markdown
# Testing Standards & Guidelines

## Component Analysis Checklist

Before writing tests, analyze the component/module using this checklist:

### 1. **Inputs (Props/Parameters)**

- [ ] What props does the component accept?
- [ ] Which props are required vs optional?
- [ ] What are the prop types? (string, number, object, function)
- [ ] Are there default prop values?

### 2. **Outputs (Return Values)**

- [ ] What does the component render?
- [ ] What does the function return?
- [ ] Are there multiple return paths (conditional rendering)?

### 3. **Side Effects**

- [ ] Does it call APIs? (mock with jest.mock)
- [ ] Does it update global state? (Redux, Context)
- [ ] Does it navigate to other pages? (useRouter, useNavigate)
- [ ] Does it trigger browser APIs? (localStorage, cookies)
- [ ] Does it log to console? (analytics, error tracking)

### 4. **Validation Rules**

- [ ] Required field validations
- [ ] Format validations (email, phone, URL)
- [ ] Length constraints (min/max characters)
- [ ] Numeric constraints (min/max values, positive only)
- [ ] Custom business rules

### 5. **User Interactions**

- [ ] Button clicks
- [ ] Form inputs (typing, selecting)
- [ ] Form submissions
- [ ] Keyboard events (Enter, Escape, Tab)
- [ ] Mouse events (hover, drag)
- [ ] Touch events (mobile)

### 6. **State Management**

- [ ] Local component state (useState)
- [ ] Form state (Formik, react-hook-form)
- [ ] Global state (Redux, Context)
- [ ] URL state (query params)
- [ ] Server state (SWR, React Query)

### 7. **Dependencies**

- [ ] External APIs
- [ ] Custom hooks
- [ ] Context providers
- [ ] Third-party libraries
- [ ] Environment variables

### 8. **Edge Cases**

- [ ] Empty values ("", [], {}, null, undefined)
- [ ] Very long strings (overflow, truncation)
- [ ] Very large numbers (infinity, max safe integer)
- [ ] Special characters in strings
- [ ] Invalid data types
- [ ] Network errors (timeout, 404, 500)
- [ ] Loading states
- [ ] Error states

## Test Categorization

Organize tests into these describe blocks:

### 1. **Rendering Tests**

Test that the component renders correctly with different props:

\`\`\`typescript
describe("Rendering", () => {
it("should render with default props", () => {
render(<Component />);
expect(screen.getByText("Default Text")).toBeInTheDocument();
});

it("should render with custom props", () => {
render(<Component title="Custom" />);
expect(screen.getByText("Custom")).toBeInTheDocument();
});

it("should not render when condition is false", () => {
render(<Component show={false} />);
expect(screen.queryByTestId("component")).not.toBeInTheDocument();
});
});
\`\`\`

### 2. **User Interaction Tests**

Test user actions and their effects:

\`\`\`typescript
describe("User Interactions", () => {
it("should call onClick handler when button is clicked", async () => {
const handleClick = jest.fn();
render(<Button onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);

});

it("should update input value on change", async () => {
render(<Input />);
const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "test" } });

    expect(input).toHaveValue("test");

});

it("should submit form with valid data", async () => {
const handleSubmit = jest.fn();
render(<Form onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" }
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: "test@example.com"
      });
    });

});
});
\`\`\`

### 3. **Validation Tests**

Test all validation rules:

\`\`\`typescript
describe("Validation", () => {
it("should show error for empty required field", async () => {
render(<Form />);
const input = screen.getByLabelText("Email");

    fireEvent.blur(input); // Trigger validation

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

});

it("should show error for invalid email format", async () => {
render(<Form />);
const input = screen.getByLabelText("Email");

    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });

});

it("should accept valid email", async () => {
render(<Form />);
const input = screen.getByLabelText("Email");

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

});
});
\`\`\`

### 4. **Edge Case Tests**

Test boundary conditions and error scenarios:

\`\`\`typescript
describe("Edge Cases", () => {
it("should handle null data gracefully", () => {
render(<Component data={null} />);
expect(screen.getByText("No data available")).toBeInTheDocument();
});

it("should handle empty array", () => {
render(<List items={[]} />);
expect(screen.getByText("No items found")).toBeInTheDocument();
});

it("should handle API error", async () => {
(fetcher as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load data")).toBeInTheDocument();
    });

});

it("should handle very long string", () => {
const longString = "a".repeat(1000);
render(<Component title={longString} />);
expect(screen.getByText(longString)).toBeInTheDocument();
});
});
\`\`\`

### 5. **Async Operation Tests**

Test loading states and async data fetching:

\`\`\`typescript
describe("Async Operations", () => {
it("should show loading state while fetching", () => {
(useSWR as jest.Mock).mockReturnValue({
data: undefined,
isLoading: true,
error: undefined,
});

    render(<Component />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

});

it("should show data after successful fetch", async () => {
(fetcher as jest.Mock).mockResolvedValue({ name: "Test" });

    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

});
});
\`\`\`

## Priority Matrix

Use this matrix to prioritize which tests to write first:

| Priority            | Category                    | Examples                                                 | When to Test                                        |
| ------------------- | --------------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| 🔴 **Critical**     | Core functionality          | Login works, Payment processes, Data saves               | **MUST TEST** - Immediate impact on business        |
| 🟡 **Important**    | Error handling & validation | Form validations, API error handling, Input sanitization | **SHOULD TEST** - Prevents user frustration         |
| 🟢 **Nice-to-have** | UX enhancements             | Loading animations, Tooltips, Theme switching            | **CAN TEST** - Improves experience but not critical |
| ⚪ **Optional**     | Visual/Style                | CSS classes, Colors, Spacing                             | **SKIP** - Use visual regression tools instead      |

### Test Writing Order:

1. **🔴 Write Critical tests first** (Happy path)
   - Does the main feature work?
   - Can users complete their primary task?

2. **🟡 Write Important tests second** (Error cases)
   - What happens when users enter invalid data?
   - What happens when the network fails?

3. **🟢 Write Nice-to-have tests last** (Edge cases)
   - Does it work with empty data?
   - Does it handle very large inputs?

## Testing Best Practices

### ✅ DO:

1. **Test behavior, not implementation**

   ```typescript
   // ✅ Good - tests what user sees
   it("should show success message after submission", async () => {
     render(<Form />);
     fireEvent.click(screen.getByRole("button", { name: /submit/i }));
     await waitFor(() => {
       expect(screen.getByText("Success!")).toBeInTheDocument();
     });
   });

   // ❌ Bad - tests internal state
   it("should set isSubmitting to true", () => {
     const { result } = renderHook(() => useForm());
     expect(result.current.isSubmitting).toBe(true);
   });
   ```
````

2. **Use descriptive test names**

   ```typescript
   // ✅ Good
   it("should display error message when email is invalid", () => {});
   it("should disable submit button while form is submitting", () => {});

   // ❌ Bad
   it("works", () => {});
   it("test 1", () => {});
   ```

3. **One assertion per test (when possible)**

   ```typescript
   // ✅ Good
   it("should render heading", () => {
     render(<Component />);
     expect(screen.getByRole("heading")).toBeInTheDocument();
   });

   it("should render button", () => {
     render(<Component />);
     expect(screen.getByRole("button")).toBeInTheDocument();
   });

   // ❌ Bad - multiple unrelated assertions
   it("should render correctly", () => {
     render(<Component />);
     expect(screen.getByRole("heading")).toBeInTheDocument();
     expect(screen.getByRole("button")).toBeEnabled();
     expect(screen.getByText("footer")).toHaveClass("text-sm");
   });
   ```

4. **Mock external dependencies**

   ```typescript
   // Mock APIs
   jest.mock("@/libs/fetcher");

   // Mock hooks
   jest.mock("@/hooks/useAuth");

   // Mock third-party libraries
   jest.mock("framer-motion");
   ```

5. **Clean up after tests**

   ```typescript
   describe("Component", () => {
     beforeEach(() => {
       jest.clearAllMocks();
     });

     afterEach(() => {
       jest.restoreAllMocks();
     });
   });
   ```

### ❌ DON'T:

1. **Don't test third-party libraries**

   ```typescript
   // ❌ Bad - testing React/library behavior
   it("useState should update state", () => {
     // Don't test React itself!
   });

   // ✅ Good - test YOUR component's behavior
   it("should update counter when button is clicked", () => {
     // Test your logic that uses useState
   });
   ```

2. **Don't use implementation details**

   ```typescript
   // ❌ Bad
   const button = container.querySelector(".btn-primary");

   // ✅ Good
   const button = screen.getByRole("button", { name: /submit/i });
   ```

3. **Don't forget to await async operations**

   ```typescript
   // ❌ Bad - will fail intermittently
   it("shows data", () => {
     render(<Component />);
     expect(screen.getByText("Data")).toBeInTheDocument(); // Might not be loaded yet!
   });

   // ✅ Good
   it("shows data", async () => {
     render(<Component />);
     await waitFor(() => {
       expect(screen.getByText("Data")).toBeInTheDocument();
     });
   });
   ```

4. **Don't test styles/CSS**

   ```typescript
   // ❌ Bad
   it("button should be blue", () => {
     expect(button).toHaveStyle({ color: "blue" });
   });

   // ✅ Good - use visual regression testing tools instead
   ```

## Coverage Guidelines

### Minimum Coverage Targets:

| Metric     | Minimum | Good | Excellent |
| ---------- | ------- | ---- | --------- |
| Statements | 70%     | 80%  | 90%+      |
| Branches   | 70%     | 80%  | 90%+      |
| Functions  | 70%     | 80%  | 90%+      |
| Lines      | 70%     | 80%  | 90%+      |

### What to Exclude from Coverage:

```javascript
// In jest.config.js
collectCoverageFrom: [
  "src/**/*.{js,jsx,ts,tsx}",
  "!src/**/*.d.ts", // Type definitions
  "!src/**/*.stories.{js,jsx,ts,tsx}", // Storybook files
  "!src/**/__tests__/**", // Test files
  "!src/**/__mocks__/**", // Mock files
  "!src/**/types/**", // Pure TypeScript types
  "!src/**/index.{ts,tsx}", // Barrel exports (optional)
];
```

### When 100% Coverage is NOT Required:

- Configuration files (next.config.js, tailwind.config.js)
- Pure type definitions
- Third-party library wrappers
- Development-only utilities
- Deprecated code (mark with `// istanbul ignore next`)
  \`\`\`

---

## Phase 6: Setup NPM Scripts

### 🚀 Configure package.json

**Bước 6.1: Add test scripts to package.json**

Open `package.json` and add/update the scripts section:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix --max-warnings=0",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",

    // ==========================================
    // TESTING SCRIPTS
    // ==========================================
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ui": "jest --watch --verbose",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:ci": "jest --ci --coverage --maxWorkers=2",

    // ==========================================
    // VALIDATION SCRIPT (pre-commit/pre-push)
    // ==========================================
    "validate": "npm run format:check && npm run lint:fix && npm run type-check && npm run test:coverage && npm run build",

    // ==========================================
    // CLEANUP
    // ==========================================
    "clean": "rm -rf .next out coverage node_modules/.cache"
  }
}
```

**Bước 6.2: Script explanations**

| Script                  | Purpose                        | When to Use                                      |
| ----------------------- | ------------------------------ | ------------------------------------------------ |
| `npm test`              | Run all tests once             | Quick test run during development                |
| `npm run test:watch`    | Run tests in watch mode        | Active development - auto re-run on file changes |
| `npm run test:coverage` | Generate coverage report       | Before commits, check coverage metrics           |
| `npm run test:ui`       | Watch mode with verbose output | Debugging test failures                          |
| `npm run test:debug`    | Run tests with Node debugger   | Debugging complex test issues                    |
| `npm run test:ci`       | CI-optimized test run          | GitHub Actions, GitLab CI, Jenkins               |
| `npm run validate`      | Run all quality checks         | Before pushing to remote, pre-commit hook        |

**Bước 6.3: Test specific files or patterns**

```bash
# Test a single file
npm test -- tests/components/Button.test.tsx

# Test all files matching a pattern
npm test -- tests/components/shared

# Test with specific test name pattern
npm test -- --testNamePattern="should render"

# Test with coverage for specific files
npm test -- --coverage --collectCoverageFrom="src/components/Button.tsx"

# Update snapshots (if using snapshot testing)
npm test -- -u
```

**Bước 6.4: Setup pre-commit hook (optional but recommended)**

Using Husky to run tests before commits:

```bash
# Install husky
npm install --save-dev husky

# Initialize husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run validate"

# Or run only tests (faster)
npx husky add .husky/pre-commit "npm test"
```

**Bước 6.5: Setup GitHub Actions CI (optional)**

Create `.github/workflows/test.yml`:

```yaml
name: Run Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests with coverage
        run: npm run test:ci

      - name: Upload coverage to Codecov (optional)
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
```

---

## Phase 7: Implement Testing Workflow

### 🔄 Complete Testing Process (8 Steps)

This is the day-to-day workflow for writing tests for new features or existing code.

---

### Bước 1: Verify Dependencies

**Mục tiêu:** Đảm bảo có đầy đủ thư viện cần thiết để test component/module

**Thực hiện:**

```bash
# Check if testing dependencies are installed
npm list jest @testing-library/react @testing-library/jest-dom

# If missing, install them (refer to Phase 1)
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

**Checklist kiểm tra dependencies theo component/module:**

| Component Uses                     | Required Test Dependency              | Installation Command                                 |
| ---------------------------------- | ------------------------------------- | ---------------------------------------------------- |
| Basic React components             | `@testing-library/react`              | `npm install --save-dev @testing-library/react`      |
| User interactions (clicks, typing) | `@testing-library/user-event`         | `npm install --save-dev @testing-library/user-event` |
| DOM assertions                     | `@testing-library/jest-dom`           | `npm install --save-dev @testing-library/jest-dom`   |
| Next.js routing                    | Mock in `jest.setup.js`               | Already handled in Phase 3                           |
| Redux                              | `@testing-library/react` + mock hooks | Already handled in Phase 3                           |
| SWR/React Query                    | Mock in test file                     | `jest.mock('swr')`                                   |
| Formik                             | `@testing-library/react`              | Already included                                     |
| Framer Motion                      | Mock in test file                     | `jest.mock('framer-motion')`                         |
| GSAP                               | Mock in test file                     | `jest.mock('gsap')`                                  |
| Axios/Fetch                        | Mock in test file                     | `jest.mock('axios')` or `global.fetch = jest.fn()`   |

**Verify jest configuration:**

```bash
# Check if jest.config.js exists
ls jest.config.js

# Check if jest.setup.js exists
ls jest.setup.js

# Check if tests/ directory exists
ls -la tests/
```

**If any missing, go back to Phase 2-4 to complete setup.**

---

### Bước 2: Đọc và phân tích component/module cần test

**Refer to Phase 7 workflow above for detailed testing process.**

---

## 📚 Real-World Testing Examples

### Example 1: Simple Component Test

**Source:** `src/components/shared/Button.tsx`

```typescript
// src/components/shared/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export function Button({ label, onClick, disabled, variant = "primary" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

**Test:** `tests/components/shared/Button.test.tsx`

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/shared/Button";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("should render with label", () => {
      render(<Button label="Click me" onClick={jest.fn()} />);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("should render primary variant by default", () => {
      render(<Button label="Test" onClick={jest.fn()} />);
      expect(screen.getByRole("button")).toHaveClass("btn-primary");
    });

    it("should render secondary variant when specified", () => {
      render(<Button label="Test" onClick={jest.fn()} variant="secondary" />);
      expect(screen.getByRole("button")).toHaveClass("btn-secondary");
    });
  });

  describe("User Interactions", () => {
    it("should call onClick when clicked", () => {
      const handleClick = jest.fn();
      render(<Button label="Click" onClick={handleClick} />);

      fireEvent.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", () => {
      const handleClick = jest.fn();
      render(<Button label="Click" onClick={handleClick} disabled />);

      fireEvent.click(screen.getByRole("button"));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard accessible", () => {
      const handleClick = jest.fn();
      render(<Button label="Click" onClick={handleClick} />);

      const button = screen.getByRole("button");
      button.focus();

      expect(button).toHaveFocus();
    });
  });
});
```

---

### Example 2: Form Validation Test (Yup Schema)

**Source:** `src/modules/auth/validation.ts`

```typescript
import * as yup from "yup";

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
```

**Test:** `tests/modules/auth/validation.test.ts`

```typescript
import { loginValidationSchema } from "@/modules/auth/validation";

describe("Login Validation Schema", () => {
  const validData = {
    email: "test@example.com",
    password: "password123",
  };

  describe("email validation", () => {
    it("should pass with valid email", async () => {
      await expect(
        loginValidationSchema.validate(validData)
      ).resolves.toBeTruthy();
    });

    it("should fail without email", async () => {
      const { email, ...data } = validData;
      await expect(loginValidationSchema.validate(data)).rejects.toThrow(
        "Email is required"
      );
    });

    it("should fail with invalid email format", async () => {
      await expect(
        loginValidationSchema.validate({
          ...validData,
          email: "invalid-email",
        })
      ).rejects.toThrow("Invalid email format");
    });

    it("should accept various valid email formats", async () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "user+tag@example.com",
      ];

      for (const email of validEmails) {
        await expect(
          loginValidationSchema.validate({ ...validData, email })
        ).resolves.toBeTruthy();
      }
    });
  });

  describe("password validation", () => {
    it("should fail without password", async () => {
      const { password, ...data } = validData;
      await expect(loginValidationSchema.validate(data)).rejects.toThrow(
        "Password is required"
      );
    });

    it("should fail with password shorter than 6 characters", async () => {
      await expect(
        loginValidationSchema.validate({
          ...validData,
          password: "12345",
        })
      ).rejects.toThrow("Password must be at least 6 characters");
    });

    it("should pass with password exactly 6 characters", async () => {
      await expect(
        loginValidationSchema.validate({
          ...validData,
          password: "123456",
        })
      ).resolves.toBeTruthy();
    });
  });
});
```

---

### Example 3: API Data Fetching Component (SWR)

**Source:** `src/components/UserList.tsx`

```typescript
import useSWR from "swr";
import { fetcher } from "@/libs/fetcher";

export function UserList() {
  const { data, error, isLoading } = useSWR("/api/users", fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load users</div>;
  if (!data) return <div>No users found</div>;

  return (
    <ul>
      {data.map((user: { id: number; name: string }) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Test:** `tests/components/UserList.test.tsx`

```typescript
import { render, screen } from "@testing-library/react";
import { UserList } from "@/components/UserList";

// Mock SWR
jest.mock("swr");
import useSWR from "swr";
const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

describe("UserList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading State", () => {
    it("should show loading state while fetching", () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        isValidating: false,
        mutate: jest.fn(),
      } as any);

      render(<UserList />);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should show error message when fetch fails", () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: new Error("Network error"),
        isLoading: false,
        isValidating: false,
        mutate: jest.fn(),
      } as any);

      render(<UserList />);
      expect(screen.getByText("Failed to load users")).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("should show no users message when data is null", () => {
      mockUseSWR.mockReturnValue({
        data: null,
        error: undefined,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn(),
      } as any);

      render(<UserList />);
      expect(screen.getByText("No users found")).toBeInTheDocument();
    });
  });

  describe("Success State", () => {
    it("should render user list when data is available", () => {
      const mockUsers = [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
        { id: 3, name: "User 3" },
      ];

      mockUseSWR.mockReturnValue({
        data: mockUsers,
        error: undefined,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn(),
      } as any);

      render(<UserList />);

      expect(screen.getByText("User 1")).toBeInTheDocument();
      expect(screen.getByText("User 2")).toBeInTheDocument();
      expect(screen.getByText("User 3")).toBeInTheDocument();
    });

    it("should render correct number of list items", () => {
      const mockUsers = [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ];

      mockUseSWR.mockReturnValue({
        data: mockUsers,
        error: undefined,
        isLoading: false,
        isValidating: false,
        mutate: jest.fn(),
      } as any);

      render(<UserList />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
    });
  });
});
```

---

### Example 4: Redux Slice Test

**Source:** `src/redux/slices/authSlice.ts`

```typescript
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: { id: number; email: string } | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: any; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
```

**Test:** `tests/redux/slices/authSlice.test.ts`

```typescript
import authReducer, { clearAuth, setAuth } from "@/redux/slices/authSlice";

describe("authSlice", () => {
  const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
  };

  describe("initial state", () => {
    it("should return the initial state", () => {
      expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
    });
  });

  describe("setAuth", () => {
    it("should set user and token", () => {
      const authData = {
        user: { id: 1, email: "test@example.com" },
        accessToken: "token123",
      };

      const state = authReducer(initialState, setAuth(authData));

      expect(state.user).toEqual(authData.user);
      expect(state.accessToken).toBe("token123");
      expect(state.isAuthenticated).toBe(true);
    });

    it("should update existing auth state", () => {
      const existingState = {
        user: { id: 1, email: "old@example.com" },
        accessToken: "oldToken",
        isAuthenticated: true,
      };

      const newAuthData = {
        user: { id: 2, email: "new@example.com" },
        accessToken: "newToken",
      };

      const state = authReducer(existingState, setAuth(newAuthData));

      expect(state.user).toEqual(newAuthData.user);
      expect(state.accessToken).toBe("newToken");
    });
  });

  describe("clearAuth", () => {
    it("should reset state to initial", () => {
      const existingState = {
        user: { id: 1, email: "test@example.com" },
        accessToken: "token123",
        isAuthenticated: true,
      };

      const state = authReducer(existingState, clearAuth());

      expect(state).toEqual(initialState);
    });
  });

  describe("state immutability", () => {
    it("should not mutate previous state", () => {
      const state1 = authReducer(
        initialState,
        setAuth({
          user: { id: 1, email: "test@example.com" },
          accessToken: "token123",
        })
      );

      const state2 = authReducer(state1, clearAuth());

      // Original state should remain unchanged
      expect(state1.isAuthenticated).toBe(true);
      expect(state2.isAuthenticated).toBe(false);
    });
  });
});
```

---

### Example 5: Utility Function Test

**Source:** `src/modules/date/formatters.ts`

```typescript
import dayjs from "dayjs";

export function formatDate(
  date: string | Date,
  format: string = "DD/MM/YYYY"
): string {
  return dayjs(date).format(format);
}

export function isDateInPast(date: string | Date): boolean {
  return dayjs(date).isBefore(dayjs(), "day");
}

export function addDays(date: string | Date, days: number): string {
  return dayjs(date).add(days, "day").format("YYYY-MM-DD");
}
```

**Test:** `tests/modules/date/formatters.test.ts`

```typescript
import dayjs from "dayjs";

import { addDays, formatDate, isDateInPast } from "@/modules/date/formatters";

// Mock dayjs to return fixed date for consistent testing
jest.mock("dayjs", () => {
  const actualDayjs = jest.requireActual("dayjs");
  const mockNow = actualDayjs("2025-01-15");

  const dayjsMock = (date?: any) => {
    if (!date) {
      return mockNow;
    }
    return actualDayjs(date);
  };

  // Copy all dayjs methods
  Object.keys(actualDayjs).forEach((key) => {
    (dayjsMock as any)[key] = (actualDayjs as any)[key];
  });

  return dayjsMock;
});

describe("Date Formatters", () => {
  describe("formatDate", () => {
    it("should format date with default format", () => {
      expect(formatDate("2025-01-15")).toBe("15/01/2025");
    });

    it("should format date with custom format", () => {
      expect(formatDate("2025-01-15", "YYYY-MM-DD")).toBe("2025-01-15");
      expect(formatDate("2025-01-15", "DD MMM YYYY")).toBe("15 Jan 2025");
    });

    it("should handle Date objects", () => {
      const date = new Date("2025-01-15");
      expect(formatDate(date)).toBe("15/01/2025");
    });

    it("should handle various date string formats", () => {
      expect(formatDate("2025-01-15")).toBe("15/01/2025");
      expect(formatDate("01/15/2025")).toBe("15/01/2025");
    });
  });

  describe("isDateInPast", () => {
    it("should return true for past dates", () => {
      expect(isDateInPast("2025-01-14")).toBe(true);
      expect(isDateInPast("2024-12-31")).toBe(true);
    });

    it("should return false for today", () => {
      expect(isDateInPast("2025-01-15")).toBe(false);
    });

    it("should return false for future dates", () => {
      expect(isDateInPast("2025-01-16")).toBe(false);
      expect(isDateInPast("2026-01-01")).toBe(false);
    });
  });

  describe("addDays", () => {
    it("should add positive days", () => {
      expect(addDays("2025-01-15", 1)).toBe("2025-01-16");
      expect(addDays("2025-01-15", 7)).toBe("2025-01-22");
    });

    it("should subtract days with negative number", () => {
      expect(addDays("2025-01-15", -1)).toBe("2025-01-14");
      expect(addDays("2025-01-15", -7)).toBe("2025-01-08");
    });

    it("should handle month boundaries", () => {
      expect(addDays("2025-01-31", 1)).toBe("2025-02-01");
      expect(addDays("2025-02-01", -1)).toBe("2025-01-31");
    });

    it("should handle year boundaries", () => {
      expect(addDays("2024-12-31", 1)).toBe("2025-01-01");
      expect(addDays("2025-01-01", -1)).toBe("2024-12-31");
    });
  });
});
```

---

## Troubleshooting & FAQ

**Chạy test cho file riêng lẻ:**

```bash
# Test một file cụ thể
npm test tests/components/shared/auth/SignIn.test.tsx

# Test với watch mode (tự động re-run khi có thay đổi)
npm test -- --watch tests/components/shared/auth/SignIn.test.tsx

# Test với coverage cho file cụ thể
npm test -- --coverage --collectCoverageFrom='src/components/shared/auth/**' tests/components/shared/auth/SignIn.test.tsx
```

**Chạy toàn bộ test suite:**

```bash
# Chạy tất cả tests
npm test

# Chạy với coverage report
npm test -- --coverage

# Chạy và tạo HTML coverage report
npm test -- --coverage --coverageReporters=html
# Sau đó mở: coverage/lcov-report/index.html
```

**Coverage targets (minimum):**

```
Statements   : 70%
Branches     : 70%
Functions    : 70%
Lines        : 70%
```

**Debug test failures:**

1. **Read error message carefully**

   ```bash
   # Error sẽ chỉ rõ:
   # - File nào bị lỗi
   # - Test case nào fail
   # - Expected vs Received values
   ```

2. **Common issues:**

   ```typescript
   // Issue: Module not found
   // Fix: Kiểm tra import path sử dụng @/ alias
   import {Component} from '@/components/...' // ✅
   import {Component} from '../../../src/...' // ❌

   // Issue: Cannot find element
   // Fix: Dùng screen.debug() để xem DOM
   render(<Component />)
   screen.debug() // In ra DOM tree

   // Issue: Async test timeout
   // Fix: Dùng waitFor và tăng timeout nếu cần
   await waitFor(
     () => {
       expect(element).toBeInTheDocument()
     },
     {timeout: 3000}
   )
   ```

3. **Verify imports hoạt động:**
   ```bash
   # Nếu có lỗi import, kiểm tra:
   # 1. Path alias @ được config trong jest.config.js
   # 2. File được import có tồn tại trong src/
   # 3. Không có typo trong tên file/folder
   ```

---

## 🛠️ Best Practices

### 1. Mock External Dependencies

```typescript
// Mock API calls
jest.mock('@/libs/fetcher', () => ({
  fetcher: jest.fn(),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: '/',
  })),
}))

// Mock Redux hooks
jest.mock('@/redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}))

// Mock framer-motion (tránh lỗi dynamic import)
jest.mock('framer-motion', () => ({
  __esModule: true,
  motion: {
    div: 'div',
    button: 'button',
    table: 'table',
  },
  AnimatePresence: ({children}: {children: React.ReactNode}) => <>{children}</>,
}))

// Mock GSAP
jest.mock('gsap', () => ({
  registerPlugin: jest.fn(),
  context: jest.fn(() => ({
    add: jest.fn(),
    revert: jest.fn(),
  })),
  fromTo: jest.fn(),
  to: jest.fn(),
}))

// Mock HeroUI components khi cần
jest.mock('@heroui/react', () => {
  const actual = jest.requireActual('@heroui/react')
  return {
    ...actual,
    Avatar: ({src, name}: {src?: string; name?: string}) => (
      <div role="button">
        <img src={src} alt={name} />
      </div>
    ),
  }
})
```

### 2. Suppress Console Warnings

```typescript
// Suppress console.warn từ third-party libraries
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: any[]) => {
    // Filter ra warnings không cần thiết
    if (
      typeof args[0] === "string" &&
      (args[0].includes("aria-label") || args[0].includes("deprecated"))
    ) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
```

### 3. Setup và Cleanup

```typescript
describe("Component", () => {
  let mockFn: jest.Mock;

  beforeEach(() => {
    // Setup trước mỗi test
    mockFn = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup sau mỗi test
    jest.restoreAllMocks();
  });

  // Tests...
});
```

### 4. Test Async Operations

```typescript
it('should fetch and display data', async () => {
  // Mock API response
  const mockData = {id: 1, name: 'Test'}
  ;(fetcher as jest.Mock).mockResolvedValue(mockData)

  render(<Component />)

  // Wait for async operation
  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  // Verify API was called
  expect(fetcher).toHaveBeenCalledWith('/api/endpoint')
})
```

### 5. Test User Interactions

```typescript
import userEvent from '@testing-library/user-event'

it('should handle user input', async () => {
  const user = userEvent.setup()
  render(<Form />)

  const input = screen.getByLabelText(/email/i)
  await user.type(input, 'test@example.com')

  const button = screen.getByRole('button', {name: /submit/i})
  await user.click(button)

  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument()
  })
})
```

### 6. Skip Tests When Necessary

```typescript
// Skip test khi có limitation của library
it.skip("opens dropdown menu on button click", () => {
  // HeroUI Ripple component không hoạt động trong test environment
  // Test này sẽ luôn fail do library limitation, không phải logic error
});
```

### 7. Handle Multiple Elements

```typescript
// Khi có nhiều elements với cùng text/role
it('should filter patients', () => {
  render(<PatientList />)

  // Sử dụng getAllByText thay vì getByText
  const genderLabels = screen.getAllByText('Nam')
  expect(genderLabels[0]).toBeInTheDocument()

  // Hoặc dùng container.querySelector với selector cụ thể hơn
  const {container} = render(<Component />)
  const avatar = container.querySelector('[role="button"] img')
  expect(avatar).toBeInTheDocument()
})
```

---

## 📚 Examples from Codebase

### Component Test Examples

**1. Simple Component with GSAP Animation:**

- File: `tests/components/shared/home/TitleAnimation.test.tsx`
- Coverage: Props testing, GSAP mocking, layout verification
- Highlights:
  - Mock GSAP context and animation methods
  - Test component renders with different props
  - Verify animation setup is called

**2. Complex Component with User Interactions:**

- File: `tests/components/shared/patient/PatientList.test.tsx`
- Coverage: Table rendering, search, filters, CRUD actions, pagination
- Highlights:
  - Mock SWR for data fetching
  - Mock custom hooks (useDeletePatient, etc.)
  - Suppress HeroUI console warnings
  - Skip dropdown interaction tests (HeroUI limitation)

**3. Component with Authentication States:**

- File: `tests/components/shared/layout/Header.test.tsx`
- Coverage: Authenticated/unauthenticated rendering, navigation, theme toggle
- Highlights:
  - Mock Redux store with different auth states
  - Mock Next.js router and navigation
  - Mock HeroUI Avatar component
  - Test conditional rendering based on auth state

**4. Feature Showcase Component:**

- File: `tests/components/shared/home/HighlightFeature.test.tsx`
- Coverage: Rendering, links, GSAP animations, responsive layout
- Highlights:
  - Mock GSAP and ScrollTrigger
  - Mock Next.js Link and Image components
  - Test multiple animation instances

### Redux Slice Test Example

- File: `tests/redux/slices/authSlice.test.ts`
- Coverage: All reducers (setAuth, setAccessToken, setRefreshToken, setUserData, clearAuth)
- Highlights:
  - Test initial state
  - Test each reducer action independently
  - Test state transitions (sequential updates)
  - Test edge cases (null values, empty strings)
  - Verify immutability

### Validation Schema Test Examples

**1. Regent Validation:**

- File: `tests/modules/regent/createUpdateRegentHelper.test.ts`
- Test từng field riêng biệt
- Test required vs optional
- Test boundary values
- Test custom validation rules

**2. Patient Validation:**

- File: `tests/modules/patient/createUpdateHelpers.test.ts`
- Test complex nested objects
- Test date validations
- Test conditional required fields

### Helper Function Test Example

- File: `tests/modules/day/index.test.ts`
- Test date formatting
- Test date parsing
- Test edge cases (leap year, timezone)
- Mock dayjs for consistent testing

---

## Troubleshooting & FAQ

### ❓ Common Issues & Solutions

#### 1. "Cannot find module '@/...'" Error

**Problem:** Import paths not resolved

```bash
Error: Cannot find module '@/components/Button'
```

**Solution:**

```bash
# 1. Check jest.config.js has correct moduleNameMapper
cat jest.config.js | grep -A 3 moduleNameMapper

# Should show:
# moduleNameMapper: {
#   "^@/(.*)$": "<rootDir>/src/$1"
# }

# 2. Check tsconfig.json paths match
cat tsconfig.json | grep -A 3 '"paths"'

# Should show:
# "paths": {
#   "@/*": ["./src/*"]
# }

# 3. Verify file exists
ls src/components/Button.tsx
```

---

#### 2. "Element not found" in Tests

**Problem:** Query returns null

```typescript
// Error: TestingLibraryElementError: Unable to find element
expect(screen.getByText("Submit")).toBeInTheDocument();
```

**Solution:**

```typescript
// 1. Use screen.debug() to see actual DOM
render(<Component />);
screen.debug(); // Prints full DOM tree

// 2. Use queryBy* for assertions about non-existence
const element = screen.queryByText("Submit");
expect(element).not.toBeInTheDocument(); // ✅ Safe for null

// 3. For async elements, use waitFor or findBy*
await waitFor(() => {
  expect(screen.getByText("Submit")).toBeInTheDocument();
});

// Or
const element = await screen.findByText("Submit");
expect(element).toBeInTheDocument();

// 4. Check text content exactly matches (case-sensitive)
screen.getByText("Submit"); // ❌ Won't find "submit"
screen.getByText(/submit/i); // ✅ Case-insensitive regex
```

---

#### 3. Tests Pass Locally but Fail in CI

**Problem:** Inconsistent test results

**Solutions:**

```bash
# 1. Run tests in CI mode locally
npm run test:ci

# 2. Clear cache before running tests
npm test -- --clearCache
npm test

# 3. Check for timezone-dependent tests
# Use fixed dates in tests instead of new Date()
jest.mock("dayjs", () => {
  const actual = jest.requireActual("dayjs");
  return jest.fn((date) => actual(date || "2025-01-01"));
});

# 4. Check for tests that depend on execution order
# Run tests in random order to detect dependencies
npm test -- --randomize
```

---

#### 4. "Act()" Warning

**Problem:**

```
Warning: An update to Component inside a test was not wrapped in act(...)
```

**Solution:**

```typescript
// ❌ Don't use act() directly
import { act } from "@testing-library/react";
// ✅ Or use userEvent instead of fireEvent
import userEvent from "@testing-library/user-event";

act(() => {
  // Don't do this
});

// ✅ Use waitFor for state updates
await waitFor(() => {
  expect(screen.getByText("Updated")).toBeInTheDocument();
});

// ✅ Or use findBy* queries (built-in waitFor)
const element = await screen.findByText("Updated");

const user = userEvent.setup();
await user.click(button); // Handles act() automatically
```

---

#### 5. Mock Not Working

**Problem:** Mock function not being called

```typescript
const mockFn = jest.fn();
jest.mock("@/libs/api");

// Test fails: mockFn not called
expect(mockFn).toHaveBeenCalled();
```

**Solution:**

```typescript
// 1. Ensure mock is hoisted BEFORE import
jest.mock("@/libs/api"); // Must be at top
import { api } from "@/libs/api";
const mockApi = api as jest.MockedFunction<typeof api>;

// 2. Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks(); // ✅ Clears call history
  // OR
  mockApi.mockReset(); // ✅ Clears implementation too
});

// 3. Verify mock is correctly typed
const mockFn = jest.fn() as jest.MockedFunction<typeof originalFn>;

// 4. Check mock is being set before component render
mockApi.mockResolvedValue({ data: "test" });
render(<Component />); // ✅ Mock set first

// Not:
render(<Component />);
mockApi.mockResolvedValue({ data: "test" }); // ❌ Too late!
```

---

#### 6. Framer Motion / Animation Library Errors

**Problem:**

```
Error: Not supported: HTMLFormElement.prototype.submit
ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG
```

**Solution:**

```typescript
// Mock framer-motion at top of test file
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    button: "button",
    form: "form",
    span: "span",
    // Add other HTML elements as needed
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
  }),
}));

// For GSAP
jest.mock("gsap", () => ({
  registerPlugin: jest.fn(),
  context: jest.fn(() => ({
    add: jest.fn(),
    revert: jest.fn(),
  })),
  to: jest.fn(),
  from: jest.fn(),
  fromTo: jest.fn(),
}));
```

---

#### 7. Coverage Not Reaching Threshold

**Problem:**

```
Jest: "global" coverage threshold for branches (70%) not met: 65.23%
```

**Solution:**

```bash
# 1. Identify uncovered lines
npm run test:coverage
open coverage/lcov-report/index.html

# 2. Focus on untested branches (if/else, switch, ternary)
# Look for yellow/red highlights in coverage report

# 3. Add tests for:
# - Error handling paths
# - Conditional rendering
# - Edge cases (null, undefined, empty)

# 4. If certain code shouldn't be covered, exclude it:
// In code:
/* istanbul ignore next */
if (process.env.NODE_ENV === "development") {
  // Development-only code
}

// In jest.config.js:
collectCoverageFrom: [
  "src/**/*.{ts,tsx}",
  "!src/dev-tools/**", // Exclude development tools
]
```

---

#### 8. Test Timeout Errors

**Problem:**

```
Timeout - Async callback was not invoked within the 5000 ms timeout
```

**Solution:**

```typescript
// 1. Increase timeout for specific test
it("slow test", async () => {
  // Test code
}, 10000); // 10 second timeout

// 2. Check for missing await
// ❌ Bad
it("test", () => {
  waitFor(() => {
    expect(screen.getByText("Data")).toBeInTheDocument();
  });
});

// ✅ Good
it("test", async () => {
  await waitFor(() => {
    expect(screen.getByText("Data")).toBeInTheDocument();
  });
});

// 3. Check mock resolves
mockApi.mockResolvedValue({ data: "test" }); // ✅
mockApi.mockReturnValue(Promise.resolve({ data: "test" })); // ✅
mockApi.mockReturnValue({ data: "test" }); // ❌ Not a promise!

// 4. Increase global timeout in jest.config.js
module.exports = {
  testTimeout: 10000, // 10 seconds
};
```

---

#### 9. Test Migration Issues

**Problem:** Tests fail after migration with import errors

```bash
Error: Cannot find module '@/components/Button'
# or
Error: Cannot find module '../../../src/components/Button'
```

**Solution:**

```bash
# 1. Verify migration script updated imports
grep -r "from '\.\./\.\./\.\./src" tests/

# If found, manually fix:
# Change: from '../../../src/components/Button'
# To:     from '@/components/Button'

# 2. Verify Jest config points to tests/
cat jest.config.js | grep -A 2 testMatch
# Should show: "<rootDir>/tests/**/*.{test,spec}.{ts,tsx}"

# 3. Clear Jest cache and retry
npm test -- --clearCache
npm test
```

---

**Problem:** Coverage broken after migration

```bash
# Error: Coverage information for src/ not found
```

**Solution:**

```javascript
// In jest.config.js
module.exports = {
  // Tests read from tests/ folder
  testMatch: ["<rootDir>/tests/**/*.{test,spec}.{ts,tsx}"],
  roots: ["<rootDir>/tests"],

  // But coverage still collects from src/ folder ✅
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    // Remove this line (no longer needed):
    // "!src/**/__tests__/**",
  ],
};
```

---

**Problem:** Test count mismatch after migration

```bash
# Before migration: 50 tests
# After migration: 45 tests
# 5 tests missing!
```

**Solution:**

```bash
# 1. Find all original test files
find src -type f \( -name "*.test.*" -o -name "*.spec.*" \) > original-tests.txt

# 2. Find all migrated test files
find tests -type f \( -name "*.test.*" -o -name "*.spec.*" \) > migrated-tests.txt

# 3. Compare counts
echo "Original: $(wc -l < original-tests.txt)"
echo "Migrated: $(wc -l < migrated-tests.txt)"

# 4. Find missing files (adjust paths for comparison)
comm -23 \
  <(cat original-tests.txt | sed 's|^src/||' | sort) \
  <(cat migrated-tests.txt | sed 's|^tests/||' | sort)

# 5. Manually migrate missing files
# Copy file to tests/ and update imports
cp src/path/to/missing.test.tsx tests/path/to/missing.test.tsx
# Edit tests/path/to/missing.test.tsx to use @/ imports

# 6. Verify all migrated
find src -type f \( -name "*.test.*" -o -name "*.spec.*" \)
# Should return: (no output)
```

---

**Problem:** `__tests__` folders not removed

```bash
$ find src -type d -name "__tests__"
src/components/__tests__
src/utils/__tests__
```

**Solution:**

```bash
# 1. Check if folders are truly empty
find src -type d -name "__tests__" -exec sh -c 'echo "{}: $(ls -A {} | wc -l) files"' \;

# 2. If empty, remove them
find src -type d -name "__tests__" -empty -delete

# 3. If not empty, list contents
find src -type d -name "__tests__" -exec ls -la {} \;

# 4. Move any remaining test files to tests/
# Then remove empty folders

# 5. Verify all removed
find src -type d -name "__tests__"
# Should return: (no output)
```

---

**Problem:** Migration script fails with "ENOENT" error

```bash
Error: ENOENT: no such file or directory, open 'tests/components/Button/Button.test.tsx'
```

**Solution:**

```bash
# The script should create directories automatically, but if it fails:

# 1. Manually create tests/ structure
mkdir -p tests/{components,modules,pages,redux,utils,hooks,libs,types}

# 2. Re-run migration
node migrate-tests.js

# 3. Or create directories on-demand during migration
# Ensure script has this code:
# const destDir = path.dirname(destFile);
# if (!fs.existsSync(destDir)) {
#   fs.mkdirSync(destDir, { recursive: true });
# }
```

---

#### 10. CI/CD Failures After Migration

**Problem:** Tests pass locally but fail in CI after migration

```bash
# Local: ✅ All tests pass
# CI: ❌ Cannot find test files
```

**Solution:**

```yaml
# 1. Check CI workflow still has correct test command
# .github/workflows/test.yml

# ❌ Bad - looking in wrong directory
- run: npm test src/

# ✅ Good - tests are now in tests/
- run: npm test

# 2. Ensure tests/ folder is committed
git status
git add tests/
git commit -m "Add tests directory"
git push

# 3. Clear CI cache (GitHub Actions)
# Go to Actions → Select workflow → Click "..." → Delete cache

# 4. Re-run workflow
```

---

### 💡 Best Practices Checklist

Before committing tests, verify:

- [ ] **All tests pass:** `npm test`
- [ ] **Coverage meets threshold:** `npm run test:coverage`
- [ ] **No console errors/warnings:** Tests run clean
- [ ] **Descriptive test names:** Clear intent
- [ ] **No skipped tests:** All `it.skip` or `describe.skip` removed
- [ ] **Mocks are cleaned up:** `beforeEach` with `jest.clearAllMocks()`
- [ ] **Async operations awaited:** No "act()" warnings
- [ ] **Tests are independent:** Can run in any order
- [ ] **Edge cases covered:** null, undefined, errors
- [ ] **TypeScript types correct:** No `any` types in tests

---

## 📊 Testing Metrics Dashboard

Track your testing progress:

```bash
# Generate coverage report
npm run test:coverage

# View summary
cat coverage/coverage-summary.json | jq

# Sample metrics to track:
# - Total test count
# - Tests per component
# - Coverage percentage
# - Test execution time
# - Number of skipped tests
```

**Quality Metrics:**

| Metric              | Target | Current  | Status       |
| ------------------- | ------ | -------- | ------------ |
| Statement Coverage  | ≥70%   | \_\_\_ % | 🟢 / 🟡 / 🔴 |
| Branch Coverage     | ≥70%   | \_\_\_ % | 🟢 / 🟡 / 🔴 |
| Function Coverage   | ≥70%   | \_\_\_ % | 🟢 / 🟡 / 🔴 |
| Line Coverage       | ≥70%   | \_\_\_ % | 🟢 / 🟡 / 🔴 |
| Test Suite Duration | <2min  | \_\_\_ s | 🟢 / 🟡 / 🔴 |

---

## 🚀 Next Steps After Setup

Once testing infrastructure is complete:

1. **Start Writing Tests**
   - Begin with critical components (auth, payment, data entry)
   - Follow Phase 7 workflow for each component

2. **Integrate with CI/CD**
   - Add GitHub Actions workflow (see Phase 6)
   - Enforce coverage thresholds in CI
   - Block merges if tests fail

3. **Add to Development Workflow**
   - Write tests alongside new features (TDD)
   - Update tests when refactoring
   - Review test coverage in code reviews

4. **Continuous Improvement**
   - Monitor flaky tests
   - Refactor test utilities
   - Update mocks as APIs change
   - Document new testing patterns

---

## 📖 Additional Resources

### Official Documentation

- Jest: https://jestjs.io/docs/getting-started
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Testing Library Queries: https://testing-library.com/docs/queries/about

### Best Practices & Guides

- Common Mistakes with React Testing Library: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library
- Testing Implementation Details: https://kentcdodds.com/blog/testing-implementation-details
- Effective Snapshot Testing: https://kentcdodds.com/blog/effective-snapshot-testing

### Tools & Utilities

- Testing Playground: https://testing-playground.com/
- Jest Preview: https://www.jest-preview.com/
- Testing Library ESLint Plugin: https://github.com/testing-library/eslint-plugin-testing-library

### Project Examples

- Check `tests/` folder in this project for real-world examples
- Review test patterns in Phase 5 for common scenarios

---

## 📝 Summary

This guide provides a complete, production-ready testing setup for React/Next.js projects:

✅ **Phase 0:** Analyzed project structure and dependencies  
✅ **Phase 1:** Installed all required testing libraries  
✅ **Phase 2:** Configured Jest with proper module resolution  
✅ **Phase 3:** Setup global test environment with mocks  
✅ **Phase 4:** Created test directory structure  
✅ **Phase 5:** Established testing standards and guidelines  
✅ **Phase 6:** Setup NPM scripts and CI/CD integration  
✅ **Phase 7:** Implemented complete 8-step testing workflow

**Key Takeaways:**

1. **Always verify dependencies** before writing tests
2. **Mock external dependencies** (APIs, routing, third-party libraries)
3. **Test user-facing behavior**, not implementation details
4. **Prioritize tests:** Critical → Important → Nice-to-have
5. **Use Testing Library queries correctly**: getByRole > getByLabelText > getByText
6. **Clean up mocks** between tests with beforeEach/afterEach
7. **Handle async operations** with waitFor or findBy\* queries
8. **Aim for 70%+ coverage** across all metrics

**This guide can be applied to ANY React/Next.js project** by following the phases in order. Adapt configurations based on your specific framework, libraries, and requirements.

---

## 🎯 Quick Reference Card

### Essential Commands

```bash
# Setup (one-time)
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest

# Migrate existing tests (if needed)
node migrate-tests.js --dry-run          # Preview migration
node migrate-tests.js                    # Run migration
find tests -name "*.test.*" | wc -l     # Count migrated tests

# Daily testing workflow
npm test                                    # Run all tests
npm test -- --watch                         # Watch mode
npm test path/to/file.test.tsx             # Single file
npm run test:coverage                       # With coverage report

# Debugging
npm test -- --verbose                       # Detailed output
npm test -- --no-coverage                   # Faster runs
npm test -- --testNamePattern="login"       # Filter by test name
```

### Test Migration Quick Guide

**When you have scattered test files:**

```bash
# 1. Find all test files
find src -name "*.test.*" -o -name "*.spec.*" -o -name "__tests__"

# 2. Create migration script (see Phase 4.5)
# Download migrate-tests.js from guide

# 3. Dry run first
node migrate-tests.js --dry-run

# 4. Backup and migrate
git commit -m "Before test migration"
node migrate-tests.js

# 5. Update Jest config
# Remove src/ from roots, update testMatch to tests/**

# 6. Verify
npm test -- --clearCache
npm test
npm run test:coverage

# 7. Cleanup
rm -rf tests-backup/
git commit -m "Migrate tests to centralized folder"
```

### Testing Checklist

**Before writing tests:**

- [ ] Verify dependencies installed (`npm list jest`)
- [ ] Check `jest.config.js` exists and path aliases match `tsconfig.json`
- [ ] Check `jest.setup.js` has required mocks
- [ ] Create test file in correct location (`tests/` folder)

**While writing tests:**

- [ ] Use descriptive test names
- [ ] Test behavior, not implementation
- [ ] Mock external dependencies
- [ ] Handle async operations with `waitFor` or `findBy*`
- [ ] Clean up mocks in `beforeEach`
- [ ] Test edge cases (null, undefined, errors)

**Before committing:**

- [ ] All tests pass
- [ ] Coverage meets threshold (≥70%)
- [ ] No console errors/warnings
- [ ] No skipped tests (`.skip` removed)
- [ ] Run `npm run validate`

### Common Patterns

```typescript
// Component rendering
render(<Component />);
expect(screen.getByRole("button")).toBeInTheDocument();

// User interactions
await user.click(screen.getByRole("button"));
await user.type(input, "text");

// Async operations
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
});

// Or use findBy (built-in waitFor)
const element = await screen.findByText("Loaded");

// Mocking
jest.mock("@/libs/api");
const mockApi = api as jest.MockedFunction<typeof api>;
mockApi.mockResolvedValue({ data: "test" });

// Cleanup
beforeEach(() => {
  jest.clearAllMocks();
});
```

### Query Priority

1. **getByRole** - Best for accessibility
2. **getByLabelText** - Good for form inputs
3. **getByPlaceholderText** - OK for inputs
4. **getByText** - OK for static text
5. **getByTestId** - Last resort

### Coverage Targets

| Metric     | Minimum | Good | Excellent |
| ---------- | ------- | ---- | --------- |
| Statements | 70%     | 80%  | 90%+      |
| Branches   | 70%     | 80%  | 90%+      |
| Functions  | 70%     | 80%  | 90%+      |
| Lines      | 70%     | 80%  | 90%+      |

---

**Happy Testing! 🧪✨**
