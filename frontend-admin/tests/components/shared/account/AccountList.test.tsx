/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { useGetUserByIdDiscloresureSingleton } from "@/hook/singleton/discloresures/account/useGetUserByIdDiscloresure";
import { useUpdateUserDiscloresureSingleton } from "@/hook/singleton/discloresures/account/useUpdateUserDiscloresure";
import { useFetchGetAllUserSwrSingleton } from "@/hook/singleton/swrs/user/useFetchGetAllUserSwr";

import AccountList from "@/components/shared/account/AccountList";

// Mock all dependencies
jest.mock("@iconify/react", () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock("@heroui/react", () => {
  const actual = jest.requireActual("@heroui/react");
  return {
    ...actual,
    User: ({ name, description }: { name: string; description: string }) => (
      <div data-testid="hero-user">
        <div>{name}</div>
        <div>{description}</div>
      </div>
    ),
    Tooltip: ({
      children,
      content,
    }: {
      children: React.ReactNode;
      content: string;
    }) => <div title={content}>{children}</div>,
    Spinner: () => <div data-testid="spinner">Loading...</div>,
  };
});

jest.mock("@/hook/singleton/swrs/user/useFetchGetAllUserSwr", () => ({
  useFetchGetAllUserSwrSingleton: jest.fn(),
}));

jest.mock(
  "@/hook/singleton/discloresures/account/useGetUserByIdDiscloresure",
  () => ({
    useGetUserByIdDiscloresureSingleton: jest.fn(),
  })
);

jest.mock(
  "@/hook/singleton/discloresures/account/useUpdateUserDiscloresure",
  () => ({
    useUpdateUserDiscloresureSingleton: jest.fn(),
  })
);

jest.mock("@/modules/user/getAllUserHelper", () => ({
  getGenderLabel: jest.fn((gender: string) => {
    if (!gender) return "-";
    if (gender.toLowerCase() === "male") return "Nam";
    if (gender.toLowerCase() === "female") return "Nữ";
    return gender;
  }),
  genderRoleLabel: jest.fn((role: string) => {
    if (!role) return "Khách";
    if (role === "role_admin") return "Quản trị viên";
    if (role === "role_doctor") return "Bác sĩ";
    if (role === "role_manager") return "Quản lý";
    if (role === "role_staff") return "Nhân viên";
    if (role === "role_patient") return "Bệnh nhân";
    return "Khách";
  }),
}));

const mockUseFetchGetAllUserSwrSingleton =
  useFetchGetAllUserSwrSingleton as jest.MockedFunction<
    typeof useFetchGetAllUserSwrSingleton
  >;
const mockUseGetUserByIdDiscloresureSingleton =
  useGetUserByIdDiscloresureSingleton as jest.MockedFunction<
    typeof useGetUserByIdDiscloresureSingleton
  >;
const mockUseUpdateUserDiscloresureSingleton =
  useUpdateUserDiscloresureSingleton as jest.MockedFunction<
    typeof useUpdateUserDiscloresureSingleton
  >;

describe("AccountList", () => {
  const mockOpenWithUserId = jest.fn();
  const mockOpenWithUser = jest.fn();

  const mockUsers = [
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      phone: "0123456789",
      address: "123 Main St",
      gender: "male",
      dateOfBirth: "01/01/1990",
      role: "role_admin",
      banned: 0,
      avatarUrl: "https://example.com/avatar1.jpg",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "0987654321",
      address: "456 Oak Ave",
      gender: "female",
      dateOfBirth: "02/02/1992",
      role: "role_doctor",
      banned: 1,
      avatarUrl: null,
    },
    {
      id: 3,
      fullName: "Bob Johnson",
      email: "bob@example.com",
      phone: "0555555555",
      address: "789 Pine Rd",
      gender: "male",
      dateOfBirth: "03/03/1985",
      role: "role_staff",
      banned: false,
      avatarUrl: undefined,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseGetUserByIdDiscloresureSingleton.mockReturnValue({
      openWithUserId: mockOpenWithUserId,
    } as any);
    mockUseUpdateUserDiscloresureSingleton.mockReturnValue({
      openWithUser: mockOpenWithUser,
    } as any);
  });

  it("renders loading state", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);
    expect(screen.getAllByTestId("spinner")[0]).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch"),
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);
    expect(screen.getByText(/Lỗi tải người dùng/)).toBeInTheDocument();
  });

  it("renders empty state when no users match filter", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);
    expect(
      screen.getByText("Không tìm thấy tài khoản nào phù hợp")
    ).toBeInTheDocument();
  });

  it("renders users list", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);
    expect(screen.getAllByText("John Doe")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Jane Smith")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Bob Johnson")[0]).toBeInTheDocument();
  });

  it("filters users by search query", async () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);

    const searchInput = screen.getByPlaceholderText(/Tìm kiếm/i);
    fireEvent.change(searchInput, { target: { value: "John" } });

    // Advance timers to trigger debounce
    jest.advanceTimersByTime(250);

    await waitFor(
      () => {
        expect(screen.getAllByText("John Doe")[0]).toBeInTheDocument();
        expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });

  it("filters users by email in search query", async () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);

    const searchInput = screen.getByPlaceholderText(/Tìm kiếm/i);
    fireEvent.change(searchInput, { target: { value: "jane@example.com" } });

    // Advance timers to trigger debounce
    jest.advanceTimersByTime(250);

    await waitFor(
      () => {
        expect(screen.getAllByText("Jane Smith")[0]).toBeInTheDocument();
        expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });

  it("filters users by phone in search query", async () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);

    const searchInput = screen.getByPlaceholderText(/Tìm kiếm/i);
    fireEvent.change(searchInput, { target: { value: "0987654321" } });

    // Advance timers to trigger debounce
    jest.advanceTimersByTime(250);

    await waitFor(
      () => {
        expect(screen.getAllByText("Jane Smith")[0]).toBeInTheDocument();
        expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });

  it("filters users by ID in search query", async () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);

    const searchInput = screen.getByPlaceholderText(/Tìm kiếm/i);
    fireEvent.change(searchInput, { target: { value: "2" } });

    // Advance timers to trigger debounce
    jest.advanceTimersByTime(250);

    await waitFor(
      () => {
        expect(screen.getAllByText("Jane Smith")[0]).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });

  it("calls openWithUserId when view button is clicked", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    const { container } = render(<AccountList />);

    const buttons = container.querySelectorAll("button");
    const viewButton = Array.from(buttons).find((btn) =>
      btn.querySelector('[data-testid="icon-mdi:eye"]')
    );
    if (viewButton) fireEvent.click(viewButton);

    expect(mockOpenWithUserId).toHaveBeenCalledWith("1");
  });

  it("calls openWithUser when edit button is clicked", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    const { container } = render(<AccountList />);

    const buttons = container.querySelectorAll("button");
    const editButton = Array.from(buttons).find((btn) =>
      btn.querySelector('[data-testid="icon-mdi:pencil"]')
    );
    if (editButton) fireEvent.click(editButton);

    expect(mockOpenWithUser).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("displays correct status for active user", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: [mockUsers[0]] },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);
    const statusElements = screen.getAllByText("Đang hoạt động");
    expect(statusElements.length).toBeGreaterThan(0);
  });

  it("displays correct status for inactive user", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: [mockUsers[1]] },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);
    const statusElements = screen.getAllByText("Ngừng hoạt động");
    expect(statusElements.length).toBeGreaterThan(0);
  });

  it("renders all table columns", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);

    expect(screen.getByText("HỌ VÀ TÊN")).toBeInTheDocument();
    expect(screen.getByText("GIỚI TÍNH")).toBeInTheDocument();
    expect(screen.getByText("VAI TRÒ")).toBeInTheDocument();
    expect(screen.getByText("NGÀY SINH")).toBeInTheDocument();
    expect(screen.getByText("SỐ ĐIỆN THOẠI")).toBeInTheDocument();
    expect(screen.getByText("EMAIL")).toBeInTheDocument();
    expect(screen.getByText("ĐỊA CHỈ")).toBeInTheDocument();
    expect(screen.getByText("TRẠNG THÁI")).toBeInTheDocument();
    expect(screen.getByText("HÀNH ĐỘNG")).toBeInTheDocument();
  });

  it('displays "-" for missing data fields', () => {
    const incompleteUser = {
      id: 4,
      fullName: "Incomplete User",
      email: "",
      phone: "",
      address: "",
      gender: "",
      dateOfBirth: "",
      role: "",
      banned: 0,
    };

    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: [incompleteUser] },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);
    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });

  it("handles non-array data gracefully", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: null },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);
    expect(
      screen.getByText("Không tìm thấy tài khoản nào phù hợp")
    ).toBeInTheDocument();
  });

  it("debounces search input", async () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);

    const searchInput = screen.getByPlaceholderText(/Tìm kiếm/i);

    // Type quickly
    fireEvent.change(searchInput, { target: { value: "J" } });
    fireEvent.change(searchInput, { target: { value: "Jo" } });
    fireEvent.change(searchInput, { target: { value: "Joh" } });
    fireEvent.change(searchInput, { target: { value: "John" } });

    // Should still show all users immediately
    expect(screen.getAllByText("John Doe")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Jane Smith")[0]).toBeInTheDocument();

    // Advance timers to trigger debounce
    jest.advanceTimersByTime(250);

    // Wait for debounce
    await waitFor(
      () => {
        expect(screen.getAllByText("John Doe")[0]).toBeInTheDocument();
        expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });

  it("renders role labels correctly", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);

    expect(screen.getAllByText("Quản trị viên").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bác sĩ").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Nhân viên").length).toBeGreaterThan(0);
  });

  it("renders gender labels correctly", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountList />);

    expect(screen.getAllByText("Nam").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Nữ")[0]).toBeInTheDocument();
  });
});
