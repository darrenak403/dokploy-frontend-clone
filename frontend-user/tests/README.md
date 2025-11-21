# Tests Directory

## 📁 Cấu trúc

Tất cả test files được tổ chức tập trung trong thư mục `tests/` theo cấu trúc tương tự như source code:

```
tests/
├── components/
│   └── shared/
│       └── layout/
│           └── Footer.test.tsx
├── modules/
│   ├── CropImage/
│   │   └── cropImage.test.ts
│   ├── day/
│   │   └── day.test.ts
│   ├── encrypt/
│   │   └── encrypt.test.ts
│   └── profile/
│       └── updateIdentityHelper.test.ts
└── redux/
    └── slices/
        └── authSlice.test.ts
```

## 🎯 Quy tắc đặt tên

- **Test files**: `<filename>.test.ts` hoặc `<filename>.test.tsx`
- **Component tests**: `<ComponentName>.test.tsx`
- **Module tests**: `<moduleName>.test.ts`
- **Redux tests**: `<sliceName>.test.ts`

## 🚀 Chạy Tests

### Chạy tất cả tests

```bash
npm test
```

### Chạy tests với coverage

```bash
npm run test:coverage
```

### Chạy tests ở watch mode

```bash
npm run test:watch
```

### Chạy một test file cụ thể

```bash
npm test -- tests/modules/encrypt/encrypt.test.ts
```

### Chạy tests theo pattern

```bash
npm test -- --testNamePattern="encrypt"
```

## 📊 Coverage Thresholds

Dự án yêu cầu coverage tối thiểu:

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

## ✅ Test Coverage hiện tại

Để xem chi tiết coverage:

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 📝 Viết Tests Mới

### 1. Tạo file test trong đúng thư mục

```bash
# Ví dụ: Test cho utils/helper.ts
touch tests/utils/helper.test.ts
```

### 2. Import module từ source code sử dụng alias

```typescript
// ✅ Đúng - Sử dụng @/ alias
import { myFunction } from '@/modules/myModule';

// ❌ Sai - Không sử dụng relative import
import { myFunction } from '../../../src/modules/myModule';
```

### 3. Cấu trúc test chuẩn

```typescript
import { functionToTest } from "@/path/to/module";

describe("Module Name", () => {
  describe("functionToTest", () => {
    it("should do something specific", () => {
      const result = functionToTest("input");
      expect(result).toBe("expected output");
    });

    it("should handle edge cases", () => {
      expect(() => functionToTest(null)).toThrow();
    });
  });
});
```

## 🛠️ Testing Utilities

### Mocking

```typescript
// Mock module
jest.mock("@/path/to/module", () => ({
  functionName: jest.fn(),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SECRET = "test-secret";
```

### Testing React Components

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Testing Redux

```typescript
import { configureStore } from "@reduxjs/toolkit";

import reducer, { actionCreator } from "@/redux/slices/mySlice";

describe("mySlice", () => {
  it("should handle action", () => {
    const state = reducer(initialState, actionCreator(payload));
    expect(state.value).toBe(expectedValue);
  });
});
```

## 🔧 Troubleshooting

### Import errors

- Đảm bảo sử dụng `@/` alias trong imports
- Kiểm tra `moduleNameMapper` trong `jest.config.js`

### Module not found

- Verify path alias trong `tsconfig.json` và `jest.config.js` khớp nhau
- Chạy `npm test` từ root directory của project

### Tests not found

- Đảm bảo file test có extension `.test.ts` hoặc `.test.tsx`
- Check `testMatch` pattern trong `jest.config.js`

## 📚 Tài liệu tham khảo

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](../TEST_WRITING_GUIDE.md)
