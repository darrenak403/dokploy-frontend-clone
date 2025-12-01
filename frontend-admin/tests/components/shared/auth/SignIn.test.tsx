/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";

import { useRouter } from "next/navigation";

import { useFetchLoginSwrSingleton } from "@/hook";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Cookies from "js-cookie";

import { SignIn } from "@/components/shared/auth/SignIn";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("@iconify/react/dist/iconify.js", () => ({
  Icon: ({ icon, onClick }: { icon: string; onClick?: () => void }) => (
    <span data-testid={`icon-${icon}`} onClick={onClick} />
  ),
}));

jest.mock("@heroui/button", () => ({
  Button: ({ children, onClick, disabled, type, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} type={type} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

jest.mock("@/hook", () => ({
  useFetchLoginSwrSingleton: jest.fn(),
}));

jest.mock("@/libs/fetcher", () => ({
  axiosNoAuth: {
    get: jest.fn(),
  },
}));

jest.mock("@/modules/encrypt", () => ({
  encryptValue: jest.fn((password: string) => `hashed_${password}`),
}));

jest.mock("js-cookie", () => ({
  __esModule: true,
  default: {
    set: jest.fn(),
  },
}));

const mockPush = jest.fn();
const mockLogin = jest.fn();

describe("SignIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useFetchLoginSwrSingleton as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("renders sign in form", () => {
    render(<SignIn />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Đăng nhập bằng Google")).toBeInTheDocument();
  });

  it("shows validation error for empty email", async () => {
    render(<SignIn />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email format", async () => {
    render(<SignIn />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });
  });

  it("shows validation error for empty password", async () => {
    render(<SignIn />);

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for short password", async () => {
    render(<SignIn />);

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByText("Must be at least 6 characters")
      ).toBeInTheDocument();
    });
  });

  it("toggles password visibility", () => {
    render(<SignIn />);

    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    const toggleIcon = screen.getByTestId("icon-mdi:eye");
    fireEvent.click(toggleIcon);

    expect(passwordInput.type).toBe("text");

    const hideIcon = screen.getByTestId("icon-mdi:eye-off");
    fireEvent.click(hideIcon);

    expect(passwordInput.type).toBe("password");
  });

  it("handles successful login", async () => {
    jest.useFakeTimers();
    mockLogin.mockResolvedValue({
      status: 200,
      data: {
        accessToken: "test-token",
      },
    });

    const { container } = render(<SignIn />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "hashed_password123",
      });
    });

    await waitFor(() => {
      expect(Cookies.set).toHaveBeenCalledWith("auth-token", "test-token", {
        expires: 7,
        secure: false,
        sameSite: "strict",
        path: "/",
      });
    });

    await waitFor(() => {
      expect(screen.getByText("Đăng nhập thành công!!!")).toBeInTheDocument();
    });

    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/service");
    });

    jest.useRealTimers();
  });

  it("handles login failure", async () => {
    jest.useFakeTimers();
    mockLogin.mockRejectedValue(new Error("Login failed"));

    const { container } = render(<SignIn />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText("Đăng nhập thất bại.")).toBeInTheDocument();
    });

    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(screen.queryByText("Đăng nhập thất bại.")).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it("renders Google and Facebook social buttons", () => {
    render(<SignIn />);

    expect(screen.getByText("Đăng nhập bằng Google")).toBeInTheDocument();
    expect(screen.getByText("Đăng nhập bằng Facebook")).toBeInTheDocument();
  });

  it("disables inputs when loading", () => {
    (useFetchLoginSwrSingleton as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: true,
    });

    render(<SignIn />);

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  it("renders logo image", () => {
    render(<SignIn />);

    const logo = screen.getByAltText("Sign In");
    expect(logo).toBeInTheDocument();
  });

  it('shows "Client-Facing" badges on social login buttons', () => {
    render(<SignIn />);

    const badges = screen.getAllByText("Client-Facing");
    expect(badges).toHaveLength(2);
  });
});
