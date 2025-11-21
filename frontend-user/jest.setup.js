// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock environment variables
process.env.NEXT_PUBLIC_SECRET = "test-secret-key-for-testing";

// Suppress console errors/warnings in tests (except for actual test failures)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Filter out React Testing Library warnings and three.js/react-three-fiber warnings
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") ||
        args[0].includes("Not implemented: HTMLFormElement.prototype.submit") ||
        args[0].includes("act(...)") ||
        args[0].includes("is using incorrect casing") ||
        args[0].includes("Use PascalCase for React components") ||
        args[0].includes("is unrecognized in this browser") ||
        args[0].includes("start its name with an uppercase letter") ||
        args[0].includes("React does not recognize the") ||
        args[0].includes("prop on a DOM element") ||
        args[0].includes("Received `true` for a non-boolean attribute") ||
        args[0].includes("pass a string instead"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
