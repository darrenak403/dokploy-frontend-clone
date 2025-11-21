/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { useFetchGetAllUserSwrSingleton } from "@/hook/singleton/swrs/user/useFetchGetAllUserSwr";

import AccountStat from "@/components/shared/account/AccountStat";

// Mock the singleton hook
jest.mock("@/hook/singleton/swrs/user/useFetchGetAllUserSwr", () => ({
  useFetchGetAllUserSwrSingleton: jest.fn(),
}));

// Mock Icon component
jest.mock("@iconify/react", () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

const mockUseFetchGetAllUserSwrSingleton =
  useFetchGetAllUserSwrSingleton as jest.MockedFunction<
    typeof useFetchGetAllUserSwrSingleton
  >;

describe("AccountStat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountStat />);

    // Should show loading placeholders
    expect(screen.getAllByText("…")).toHaveLength(4);
  });

  it("renders empty state with no users", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountStat />);

    expect(screen.getByText("Tất cả người dùng")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(4);
  });

  it("calculates stats correctly for users with complete profiles", () => {
    const mockUsers = [
      {
        id: 1,
        fullName: "User 1",
        phone: "0123456789",
        email: "user1@example.com",
        address: "123 Street",
        gender: "male",
        dateOfBirth: "01/01/1990",
      },
      {
        id: 2,
        fullName: "User 2",
        phone: "0987654321",
        email: "user2@example.com",
        address: "456 Street",
        gender: "female",
        dateOfBirth: "02/02/1992",
      },
    ];

    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountStat />);

    expect(screen.getByText("Tất cả người dùng")).toBeInTheDocument();
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
    expect(screen.getByText("100% hồ sơ hoàn chỉnh")).toBeInTheDocument();
  });

  it("calculates stats correctly for users with incomplete profiles", () => {
    const mockUsers = [
      {
        id: 1,
        fullName: "Complete User",
        phone: "0123456789",
        email: "complete@example.com",
        address: "123 Street",
        gender: "male",
        dateOfBirth: "01/01/1990",
      },
      {
        id: 2,
        fullName: "Incomplete User",
        phone: "", // missing phone
        email: "incomplete@example.com",
        address: "",
        gender: "",
        dateOfBirth: "",
      },
    ];

    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountStat />);

    expect(screen.getByText("Hồ sơ hoàn chỉnh")).toBeInTheDocument();
    expect(screen.getByText("50% hồ sơ hoàn chỉnh")).toBeInTheDocument();
    expect(screen.getByText("Hồ sơ chưa hoàn chỉnh")).toBeInTheDocument();
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });

  it("counts male users correctly", () => {
    const mockUsers = [
      {
        id: 1,
        fullName: "Male User 1",
        phone: "0123456789",
        email: "male1@example.com",
        address: "123 Street",
        gender: "male",
        dateOfBirth: "01/01/1990",
      },
      {
        id: 2,
        fullName: "Male User 2",
        phone: "0123456789",
        email: "male2@example.com",
        address: "456 Street",
        gender: "MALE",
        dateOfBirth: "02/02/1992",
      },
      {
        id: 3,
        fullName: "Female User",
        phone: "0123456789",
        email: "female@example.com",
        address: "789 Street",
        gender: "female",
        dateOfBirth: "03/03/1993",
      },
    ];

    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountStat />);

    expect(screen.getByText("Nam")).toBeInTheDocument();
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
  });

  it("handles undefined data gracefully", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountStat />);

    expect(screen.getByText("Tất cả người dùng")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(4);
  });

  it("handles non-array data gracefully", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: null },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountStat />);

    expect(screen.getByText("Tất cả người dùng")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(4);
  });

  it("renders all stat cards with correct titles", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountStat />);

    expect(screen.getByText("Tất cả người dùng")).toBeInTheDocument();
    expect(screen.getByText("Hồ sơ hoàn chỉnh")).toBeInTheDocument();
    expect(screen.getByText("Hồ sơ chưa hoàn chỉnh")).toBeInTheDocument();
    expect(screen.getByText("Nam")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(4);
  });

  it("renders all icons", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountStat />);

    expect(screen.getByTestId("icon-mdi:account-group")).toBeInTheDocument();
    expect(screen.getByTestId("icon-mdi:clipboard-check")).toBeInTheDocument();
    expect(screen.getByTestId("icon-mdi:alert-circle")).toBeInTheDocument();
    expect(screen.getByTestId("icon-mdi:gender-male")).toBeInTheDocument();
  });

  it("calculates percentage correctly with rounding", () => {
    const mockUsers = [
      {
        id: 1,
        fullName: "User 1",
        phone: "0123456789",
        email: "user1@example.com",
        address: "123 Street",
        gender: "male",
        dateOfBirth: "01/01/1990",
      },
      {
        id: 2,
        fullName: "User 2",
        phone: "",
        email: "user2@example.com",
        address: "",
        gender: "",
        dateOfBirth: "",
      },
      {
        id: 3,
        fullName: "User 3",
        phone: "",
        email: "user3@example.com",
        address: "",
        gender: "",
        dateOfBirth: "",
      },
    ];

    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountStat />);

    // 1 complete out of 3 = 33.33% -> rounds to 33%
    expect(screen.getByText("33% hồ sơ hoàn chỉnh")).toBeInTheDocument();
  });

  it("handles case-insensitive gender filtering", () => {
    const mockUsers = [
      {
        id: 1,
        fullName: "User 1",
        phone: "0123456789",
        email: "user1@example.com",
        address: "123 Street",
        gender: "Male", // Mixed case
        dateOfBirth: "01/01/1990",
      },
      {
        id: 2,
        fullName: "User 2",
        phone: "0123456789",
        email: "user2@example.com",
        address: "456 Street",
        gender: "MALE", // Upper case
        dateOfBirth: "02/02/1992",
      },
      {
        id: 3,
        fullName: "User 3",
        phone: "0123456789",
        email: "user3@example.com",
        address: "789 Street",
        gender: "female", // Lower case
        dateOfBirth: "03/03/1993",
      },
    ];

    mockUseFetchGetAllUserSwrSingleton.mockReturnValue({
      data: { data: mockUsers },
      isLoading: false,
      error: undefined,
      mutate: jest.fn(),
      isValidating: false,
    } as any);

    render(<AccountStat />);

    expect(screen.getByText("2")).toBeInTheDocument(); // male count
  });

  it("renders with null hook return value", () => {
    mockUseFetchGetAllUserSwrSingleton.mockReturnValue(null as any);

    render(<AccountStat />);

    expect(screen.getByText("Tất cả người dùng")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(4);
  });
});
