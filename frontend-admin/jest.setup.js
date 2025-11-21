import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// Mock environment variables
process.env.NEXT_PUBLIC_SECRET = "test-secret-key-for-encryption";

// Suppress console warnings for specific messages
const originalWarn = console.warn;
const originalError = console.error;
const originalLog = console.log;

beforeAll(() => {
  console.warn = (...args) => {
    const message = args[0];
    // Suppress aria-label warnings from React Aria/HeroUI
    if (
      typeof message === "string" &&
      (message.includes("aria-label") ||
        message.includes("aria-labelledby") ||
        message.includes("visible label"))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args) => {
    const message = typeof args[0] === "string" ? args[0] : String(args[0]);
    // Suppress specific React warnings during tests
    if (
      message.includes("Warning: ReactDOM.render") ||
      message.includes("Warning: useLayoutEffect") ||
      // Suppress decryption errors (intentional for error handling tests)
      message.includes("Decryption error:") ||
      message.includes("Safe decrypt failed:") ||
      // Suppress React DOM prop warnings
      message.includes("React does not recognize") ||
      message.includes("isLoading") ||
      message.includes("isDisabled") ||
      message.includes("Unknown event handler property") ||
      message.includes("onPress") ||
      // Suppress React act() warnings
      message.includes("not wrapped in act(...)")
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  console.log = (...args) => {
    const message = typeof args[0] === "string" ? args[0] : String(args[0]);
    // Suppress intentional error logs from tests
    if (
      message.includes("Error: Login failed") ||
      (message.includes("Error:") && args[0] instanceof Error)
    ) {
      return;
    }
    originalLog.apply(console, args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
  console.log = originalLog;
});

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Add TextEncoder and TextDecoder to global scope
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock crypto.subtle for Web Crypto API
const crypto = require("crypto");
if (typeof global.crypto === "undefined") {
  global.crypto = crypto.webcrypto;
} else if (!global.crypto.subtle) {
  global.crypto.subtle = crypto.webcrypto.subtle;
}
