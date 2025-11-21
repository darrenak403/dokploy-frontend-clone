/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";

import { useRouter } from "next/navigation";

import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { useFetchRegisterSwrSingleton } from "@/hook/singleton/swrs/auth/useFetchRegisterSwr";

import { SignUp } from "@/components/shared/auth/SignUp";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
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

jest.mock("@/hook/singleton/swrs/auth/useFetchRegisterSwr", () => ({
  useFetchRegisterSwrSingleton: jest.fn(),
}));

jest.mock("@/types/hashPassword", () => ({
  hashPasswordSHA256: jest.fn((password: string) =>
    Promise.resolve(`hashed_${password}`)
  ),
}));

const mockPush = jest.fn();
const mockRegister = jest.fn();

describe("SignUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useFetchRegisterSwrSingleton as jest.Mock).mockReturnValue({
      register: mockRegister,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("renders sign up form", () => {
    render(<SignUp />);

    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
  });

  it("renders social login buttons", () => {
    render(<SignUp />);

    expect(screen.getByText("Login with Google")).toBeInTheDocument();
    expect(screen.getByText("Login with Facebook")).toBeInTheDocument();
  });

  it("renders sign in link", () => {
    render(<SignUp />);

    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    const signInLink = screen.getByText("Sign in").closest("a");
    expect(signInLink).toHaveAttribute("href", "/signin");
  });

  it("shows validation error for empty full name", async () => {
    render(<SignUp />);

    const fullNameInput = screen.getByLabelText("Full Name");
    fireEvent.blur(fullNameInput);

    await waitFor(() => {
      expect(screen.getByText("Full name is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for empty email", async () => {
    render(<SignUp />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email format", async () => {
    render(<SignUp />);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });
  });

  it("shows validation error for empty password", async () => {
    render(<SignUp />);

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for short password", async () => {
    render(<SignUp />);

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "Pass1" } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByText("Must be at least 8 characters")
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for password without uppercase", async () => {
    render(<SignUp />);

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByText("Mật khẩu phải có ít nhất 1 chữ hoa")
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for password without lowercase", async () => {
    render(<SignUp />);

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "PASSWORD123" } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByText("Mật khẩu phải có ít nhất 1 chữ thường")
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for password without number", async () => {
    render(<SignUp />);

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "Password" } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByText("Mật khẩu phải có ít nhất 1 số")
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for mismatched passwords", async () => {
    render(<SignUp />);

    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");

    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password456" },
    });
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText("Passwords must match")).toBeInTheDocument();
    });
  });

  it("shows validation error for empty confirm password", async () => {
    render(<SignUp />);

    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(
        screen.getByText("Confirm password is required")
      ).toBeInTheDocument();
    });
  });

  it("toggles password visibility", () => {
    render(<SignUp />);

    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    const toggleIcons = screen.getAllByTestId("icon-mdi:eye");
    fireEvent.click(toggleIcons[0]);

    expect(passwordInput.type).toBe("text");

    const hideIcons = screen.getAllByTestId("icon-mdi:eye-off");
    fireEvent.click(hideIcons[0]);

    expect(passwordInput.type).toBe("password");
  });

  it("toggles confirm password visibility", () => {
    render(<SignUp />);

    const confirmPasswordInput = screen.getByLabelText(
      "Confirm password"
    ) as HTMLInputElement;
    expect(confirmPasswordInput.type).toBe("password");

    const toggleIcons = screen.getAllByTestId("icon-mdi:eye");
    fireEvent.click(toggleIcons[1]);

    expect(confirmPasswordInput.type).toBe("text");

    const hideIcons = screen.queryAllByTestId("icon-mdi:eye-off");
    if (hideIcons.length > 1) {
      fireEvent.click(hideIcons[1]);
      expect(confirmPasswordInput.type).toBe("password");
    }
  });

  it("handles successful registration", async () => {
    jest.useFakeTimers();
    mockRegister.mockResolvedValue({
      status: 201,
      message: "Success",
    });

    const { container } = render(<SignUp />);

    const fullNameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password123" },
    });

    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "hashed_Password123",
        fullName: "John Doe",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Đăng kí thành công! Chuyển hướng tới trang đăng nhập..."
        )
      ).toBeInTheDocument();
    });

    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/signin");
    });

    jest.useRealTimers();
  });

  it("handles registration failure with message", async () => {
    mockRegister.mockResolvedValue({
      status: 400,
      message: "Email already exists",
    });

    const { container } = render(<SignUp />);

    const fullNameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password123" },
    });

    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
  });

  it("handles registration error exception", async () => {
    mockRegister.mockRejectedValue(new Error("Network error"));

    const { container } = render(<SignUp />);

    const fullNameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm password");

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password123" },
    });

    const form = container.querySelector("form");
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("disables inputs when loading", () => {
    (useFetchRegisterSwrSingleton as jest.Mock).mockReturnValue({
      register: mockRegister,
      loading: true,
    });

    render(<SignUp />);

    const fullNameInput = screen.getByLabelText(
      "Full Name"
    ) as HTMLInputElement;
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(
      "Confirm password"
    ) as HTMLInputElement;

    expect(fullNameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(confirmPasswordInput).toBeDisabled();
  });

  it("renders logo image", () => {
    render(<SignUp />);

    const logo = screen.getByAltText("Sign Up");
    expect(logo).toBeInTheDocument();
  });

  it('renders divider with "or" text', () => {
    render(<SignUp />);

    expect(screen.getByText("or")).toBeInTheDocument();
  });
});
