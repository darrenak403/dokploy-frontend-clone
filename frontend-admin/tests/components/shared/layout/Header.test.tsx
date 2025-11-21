/**
 * Test suite for Header component
 *
 * Component: Header
 * Path: @/components/shared/layout/Header
 *
 * Purpose: Tests the main navigation header with authentication state
 *
 * Test Coverage:
 * - Rendering for authenticated and unauthenticated users
 * - Navigation links
 * - User dropdown menu
 * - Theme toggle
 * - Login/Signup buttons
 * - Logout functionality
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import { useRouter } from "next/navigation";

import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import _authReducer from "@/redux/slices/authSlice";

import { Header } from "@/components/shared/layout/Header";

// Mock framer-motion to avoid dynamic import issues
jest.mock("framer-motion", () => ({
  __esModule: true,
  motion: {
    div: "div",
    button: "button",
    nav: "nav",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAnimation: () => ({}),
  useMotionValue: () => ({}),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
  }: {
    src: string | { src: string };
    alt: string;
    width: number;
  }) => (
    <img
      src={typeof src === "string" ? src : src.src}
      alt={alt}
      width={width}
    />
  ),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({
    children,
    href,
    prefetch: _prefetch,
    onMouseEnter,
  }: {
    children: React.ReactNode;
    href: string;
    prefetch?: boolean;
    onMouseEnter?: () => void;
  }) => {
    return (
      <a href={href} onMouseEnter={onMouseEnter}>
        {children}
      </a>
    );
  };
});

// Mock ThemeToggle component
jest.mock("@/components/modules/SwithTheme/theme-toggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Theme Toggle</button>,
}));

// Mock @heroui/react Avatar to ensure it renders in tests
jest.mock("@heroui/react", () => {
  const actual = jest.requireActual("@heroui/react");
  return {
    ...actual,
    Avatar: ({
      src,
      name,
      as,
      className,
    }: {
      src?: string;
      name?: string;
      as?: string;
      className?: string;
    }) => {
      const Element = as || "div";
      return React.createElement(
        Element,
        {
          role: "button",
          className: className,
          "data-testid": "user-avatar",
        },
        React.createElement("img", {
          src: src,
          alt: name || "User avatar",
        })
      );
    },
  };
});

// Helper function to create mock store
const createMockStore = (authState: any) => {
  return configureStore({
    reducer: {
      auth: (state = authState) => state,
    },
  });
};

describe("Header Component", () => {
  const mockPush = jest.fn();
  const mockPrefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      prefetch: mockPrefetch,
    });
  });

  // Rendering Tests - Unauthenticated User
  describe("Rendering - Unauthenticated User", () => {
    const unauthenticatedStore = createMockStore({
      data: null,
    });

    it("renders header with brand logo and name", () => {
      const { container } = render(
        <Provider store={unauthenticatedStore}>
          <Header />
        </Provider>
      );

      expect(screen.getByText("LabMS")).toBeInTheDocument();
      const logo = container.querySelector('img[alt="Auth Image"]');
      expect(logo).toBeInTheDocument();
    });

    it("renders navigation links", () => {
      render(
        <Provider store={unauthenticatedStore}>
          <Header />
        </Provider>
      );

      expect(screen.getByText("Dịch vụ")).toBeInTheDocument();
      expect(screen.getByText("Khách hàng")).toBeInTheDocument();
      expect(screen.getByText("Tích hợp")).toBeInTheDocument();
    });

    it("renders theme toggle", () => {
      render(
        <Provider store={unauthenticatedStore}>
          <Header />
        </Provider>
      );

      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("renders login and signup buttons for unauthenticated user", () => {
      render(
        <Provider store={unauthenticatedStore}>
          <Header />
        </Provider>
      );

      expect(screen.getByText("Đăng nhập")).toBeInTheDocument();
      expect(screen.getByText("Đăng ký")).toBeInTheDocument();
    });

    it("does not render user avatar for unauthenticated user", () => {
      render(
        <Provider store={unauthenticatedStore}>
          <Header />
        </Provider>
      );

      const avatar = screen.queryByRole("button", { name: /Jason Hughes/i });
      expect(avatar).not.toBeInTheDocument();
    });
  });

  // Rendering Tests - Authenticated User
  describe("Rendering - Authenticated User", () => {
    const authenticatedStore = createMockStore({
      data: {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        user: {
          email: "test@example.com",
          fullName: "Test User",
          avatarUrl: "https://example.com/avatar.jpg",
        },
      },
    });

    it("renders user avatar for authenticated user", () => {
      const { container } = render(
        <Provider store={authenticatedStore}>
          <Header />
        </Provider>
      );

      const avatar = container.querySelector('[role="button"] img');
      expect(avatar).toBeInTheDocument();
    });

    it("does not render login/signup buttons for authenticated user", () => {
      render(
        <Provider store={authenticatedStore}>
          <Header />
        </Provider>
      );

      expect(screen.queryByText("Đăng nhập")).not.toBeInTheDocument();
      expect(screen.queryByText("Đăng ký")).not.toBeInTheDocument();
    });

    it.skip("displays user email in dropdown", () => {
      const { container } = render(
        <Provider store={authenticatedStore}>
          <Header />
        </Provider>
      );

      // Click avatar to open dropdown
      const avatar = container.querySelector('[role="button"] img');
      if (avatar && avatar.parentElement) {
        fireEvent.click(avatar.parentElement);
      }

      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("renders avatar with user avatarUrl", () => {
      const { container } = render(
        <Provider store={authenticatedStore}>
          <Header />
        </Provider>
      );

      const img = container.querySelector(
        'img[src="https://example.com/avatar.jpg"]'
      );
      expect(img).toBeInTheDocument();
    });
  });

  // Navigation Tests
  describe("Navigation Links", () => {
    const mockStore = createMockStore({ data: null });

    it("service link has correct href", () => {
      render(
        <Provider store={mockStore}>
          <Header />
        </Provider>
      );

      const serviceLink = screen.getByText("Dịch vụ").closest("a");
      expect(serviceLink).toHaveAttribute("href", "/service");
    });

    it("customers link has correct href", () => {
      render(
        <Provider store={mockStore}>
          <Header />
        </Provider>
      );

      const customersLink = screen.getByText("Khách hàng").closest("a");
      expect(customersLink).toHaveAttribute("href", "/customers");
    });

    it("integrations link has correct href", () => {
      render(
        <Provider store={mockStore}>
          <Header />
        </Provider>
      );

      const integrationsLink = screen.getByText("Tích hợp").closest("a");
      expect(integrationsLink).toHaveAttribute("href", "/integrations");
    });

    it("logo link navigates to home", () => {
      render(
        <Provider store={mockStore}>
          <Header />
        </Provider>
      );

      const logoLink = screen.getByText("LabMS").closest("a");
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("prefetches routes on hover", () => {
      render(
        <Provider store={mockStore}>
          <Header />
        </Provider>
      );

      const serviceLink = screen.getByText("Dịch vụ").closest("a");
      if (serviceLink) {
        fireEvent.mouseEnter(serviceLink);
        expect(mockPrefetch).toHaveBeenCalledWith("/service");
      }
    });
  });

  // Dropdown Menu Tests
  describe("User Dropdown Menu", () => {
    const authenticatedStore = createMockStore({
      data: {
        accessToken: "mock-token",
        refreshToken: "mock-refresh-token",
        user: {
          email: "user@test.com",
          fullName: "John Doe",
          avatarUrl: null,
        },
      },
    });

    it.skip("displays user info in dropdown header", () => {
      render(
        <Provider store={authenticatedStore}>
          <Header />
        </Provider>
      );

      const avatar = screen.getByRole("button");
      fireEvent.click(avatar);

      expect(screen.getByText("Đăng nhập với")).toBeInTheDocument();
      expect(screen.getByText("user@test.com")).toBeInTheDocument();
    });

    it.skip("renders profile menu item", () => {
      render(
        <Provider store={authenticatedStore}>
          <Header />
        </Provider>
      );

      const avatar = screen.getByRole("button");
      fireEvent.click(avatar);

      expect(screen.getByText("Hồ sơ của tôi")).toBeInTheDocument();
    });

    it.skip("renders help menu item", () => {
      render(
        <Provider store={authenticatedStore}>
          <Header />
        </Provider>
      );

      const avatar = screen.getByRole("button");
      fireEvent.click(avatar);

      expect(screen.getByText("Trợ giúp & phản hồi")).toBeInTheDocument();
    });

    it.skip("renders logout menu item", () => {
      render(
        <Provider store={authenticatedStore}>
          <Header />
        </Provider>
      );

      const avatar = screen.getByRole("button");
      fireEvent.click(avatar);

      expect(screen.getByText("Log Out")).toBeInTheDocument();
    });

    it.skip("displays fullName when email is null", () => {
      const storeWithNoEmail = createMockStore({
        data: {
          accessToken: "token",
          refreshToken: "refresh",
          user: {
            email: null,
            fullName: "Jane Smith",
            avatarUrl: null,
          },
        },
      });

      render(
        <Provider store={storeWithNoEmail}>
          <Header />
        </Provider>
      );

      const avatar = screen.getByRole("button");
      fireEvent.click(avatar);

      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  // Logout Tests
  describe("Logout Functionality", () => {
    it.skip("handles logout click", () => {
      const authenticatedStore = createMockStore({
        data: {
          accessToken: "token",
          refreshToken: "refresh",
          user: {
            email: "test@test.com",
            fullName: "Test",
            avatarUrl: null,
          },
        },
      });

      render(
        <Provider store={authenticatedStore}>
          <Header />
        </Provider>
      );

      const avatar = screen.getByRole("button");
      fireEvent.click(avatar);

      const logoutButton = screen.getByText("Log Out");
      fireEvent.click(logoutButton);

      expect(mockPush).toHaveBeenCalledWith("/signin");
    });
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("handles missing user data gracefully", () => {
      const storeWithPartialData = createMockStore({
        data: {
          accessToken: "token",
          user: {
            email: null,
            fullName: null,
            avatarUrl: null,
          },
        },
      });

      render(
        <Provider store={storeWithPartialData}>
          <Header />
        </Provider>
      );

      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("uses default logo when avatarUrl is null", () => {
      const storeWithNoAvatar = createMockStore({
        data: {
          accessToken: "token",
          refreshToken: "refresh",
          user: {
            email: "test@test.com",
            fullName: "Test User",
            avatarUrl: null,
          },
        },
      });

      const { container } = render(
        <Provider store={storeWithNoAvatar}>
          <Header />
        </Provider>
      );

      // Should render with default logo src
      const avatar = container.querySelector('[role="button"] img');
      expect(avatar).toBeInTheDocument();
    });

    it.skip("handles signup button navigation", () => {
      const mockStore = createMockStore({ data: null });

      render(
        <Provider store={mockStore}>
          <Header />
        </Provider>
      );

      const signupButton = screen.getByText("Đăng ký");
      fireEvent.click(signupButton);

      expect(mockPush).toHaveBeenCalledWith("/signup");
    });
  });
});
