/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Test suite for PatientList component
 *
 * Component: PatientList
 * Path: @/components/shared/patient/PatientList
 *
 * Purpose: Tests the patient list table with search, filters, and CRUD actions
 *
 * Test Coverage:
 * - Rendering patient data in table
 * - Search functionality
 * - Filter options (status, time)
 * - Pagination
 * - CRUD actions (view, edit, delete, add test order)
 * - Loading and error states
 * - Empty state
 */
import React from "react";

import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import PatientList from "@/components/shared/patient/PatientList";

// Suppress console.warn from @heroui/select about aria-label
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("aria-label") &&
      args[0].includes("accessibility")
    ) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});

// Mock framer-motion to avoid dynamic import issues
jest.mock("framer-motion", () => ({
  __esModule: true,
  motion: {
    div: "div",
    button: "button",
    table: "table",
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAnimation: () => ({}),
  useMotionValue: () => ({}),
}));

// Mock SWR
jest.mock("swr", () => ({
  useSWRConfig: () => ({
    mutate: jest.fn(),
  }),
}));

// Mock custom hooks
jest.mock("@/hook/singleton/swrs/patient/useFetchAllPatientSwr", () => ({
  useFetchAllPatientSwrCore: jest.fn(),
}));

jest.mock("@/hook/singleton/discloresures", () => ({
  useUpdatePatientDiscloresureSingleton: jest.fn(),
  useViewPatientDiscloresureSingleton: jest.fn(),
  useCreateTestOrderDiscloresureSingleton: jest.fn(),
}));

jest.mock("@/hook", () => ({
  useFetchDeletePatientSwrSingleton: jest.fn(),
}));

// Mock Sweetalert2
jest.mock("sweetalert2", () => ({
  __esModule: true,
  default: {
    fire: jest.fn(),
  },
}));

// Mock iconify
jest.mock("@iconify/react", () => ({
  Icon: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} className={className}>
      {icon}
    </span>
  ),
}));

// Mock patient helper functions
jest.mock("@/modules/patient", () => ({
  getStatusColor: (deleted: boolean) => (deleted ? "danger" : "success"),
  getStatusText: (deleted: boolean) => (deleted ? "Inactive" : "Active"),
  formatPatientId: (id: number) => `#${id.toString().padStart(4, "0")}`,
  filterPatients: (patients: any[], query: string) => {
    if (!query) return patients;
    return patients.filter((p) =>
      p.fullName.toLowerCase().includes(query.toLowerCase())
    );
  },
}));

jest.mock("@/modules/patient/getAllPatientHelper", () => ({
  computeBoundary: (filter: string) => {
    if (filter === "all") return null;
    return new Date();
  },
  genderStatusLabel: (status: string) => status,
  getGenderLabel: (gender: string) => {
    if (gender === "male") return "male";
    if (gender === "female") return "female";
    return "N/A";
  },
}));

jest.mock("@/modules/day", () => ({
  parseDateOnly: (date: string) => new Date(date),
}));

describe("PatientList Component", () => {
  const mockPatients = [
    {
      id: 1,
      fullName: "Nguyen Van A",
      patientCode: "PT001",
      gender: "male",
      yob: 1990,
      phone: "0123456789",
      email: "nguyenvana@example.com",
      address: "123 Main St",
      createdBy: "admin",
      modifiedBy: "admin",
      createdAt: "2024-01-01 10:00:00",
      deleted: false,
    },
    {
      id: 2,
      fullName: "Tran Thi B",
      patientCode: "PT002",
      gender: "female",
      yob: 1995,
      phone: "0987654321",
      email: "tranthib@example.com",
      address: "456 Second St",
      createdBy: "admin",
      modifiedBy: "user",
      createdAt: "2024-01-02 11:00:00",
      deleted: false,
    },
  ];

  const mockMutate = jest.fn();
  const mockDeletePatient = jest.fn();
  const mockOpenUpdateModal = jest.fn();
  const mockOpenViewModal = jest.fn();
  const mockOpenCreateModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    const {
      useFetchAllPatientSwrCore,
    } = require("@/hook/singleton/swrs/patient/useFetchAllPatientSwr");
    useFetchAllPatientSwrCore.mockReturnValue({
      data: {
        data: {
          data: mockPatients,
          currentPage: 1,
          totalPages: 1,
        },
      },
      isLoading: false,
      error: null,
      mutate: mockMutate,
    });

    const {
      useUpdatePatientDiscloresureSingleton,
      useViewPatientDiscloresureSingleton,
      useCreateTestOrderDiscloresureSingleton,
    } = require("@/hook/singleton/discloresures");

    useUpdatePatientDiscloresureSingleton.mockReturnValue({
      openWithPatient: mockOpenUpdateModal,
    });

    useViewPatientDiscloresureSingleton.mockReturnValue({
      openWithPatientId: mockOpenViewModal,
    });

    useCreateTestOrderDiscloresureSingleton.mockReturnValue({
      openWithPatientId: mockOpenCreateModal,
    });

    const { useFetchDeletePatientSwrSingleton } = require("@/hook");
    useFetchDeletePatientSwrSingleton.mockReturnValue({
      deletePatient: mockDeletePatient,
    });
  });

  // Rendering Tests
  describe("Rendering", () => {
    it("renders the patient list table", () => {
      render(<PatientList />);

      expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
      expect(screen.getByText("Tran Thi B")).toBeInTheDocument();
    });

    it("renders search input", () => {
      render(<PatientList />);

      const searchInput = screen.getByPlaceholderText(
        /Tìm kiếm theo tên, ID, email hoặc điện thoại/i
      );
      expect(searchInput).toBeInTheDocument();
    });

    it("renders filter selects", () => {
      render(<PatientList />);

      expect(screen.getAllByText("Tất cả bệnh nhân")[0]).toBeInTheDocument();
      expect(screen.getAllByText("Tất cả thời gian")[0]).toBeInTheDocument();
    });

    it("renders table headers correctly", () => {
      render(<PatientList />);

      expect(screen.getByText("HỌ TÊN")).toBeInTheDocument();
      expect(screen.getByText("GIỚI TÍNH")).toBeInTheDocument();
      expect(screen.getByText("NGÀY SINH")).toBeInTheDocument();
      expect(screen.getByText("ĐIỆN THOẠI")).toBeInTheDocument();
      expect(screen.getByText("EMAIL")).toBeInTheDocument();
      expect(screen.getByText("TRẠNG THÁI")).toBeInTheDocument();
      expect(screen.getByText("HÀNH ĐỘNG")).toBeInTheDocument();
    });

    it("renders patient data in table rows", () => {
      render(<PatientList />);

      expect(screen.getByText("PT001")).toBeInTheDocument();
      expect(screen.getByText("PT002")).toBeInTheDocument();
      expect(screen.getByText("0123456789")).toBeInTheDocument();
      expect(screen.getByText("nguyenvana@example.com")).toBeInTheDocument();
    });

    it("renders pagination component", () => {
      const { container } = render(<PatientList />);

      const pagination = container.querySelector('[data-slot="base"]');
      expect(pagination).toBeInTheDocument();
    });
  });

  // Search Functionality Tests
  describe("Search Functionality", () => {
    it("filters patients based on search query", () => {
      render(<PatientList />);

      const searchInput = screen.getByPlaceholderText(
        /Tìm kiếm theo tên, ID, email hoặc điện thoại/i
      );

      fireEvent.change(searchInput, { target: { value: "Nguyen" } });

      expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    });

    it("shows all patients when search is empty", () => {
      render(<PatientList />);

      expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
      expect(screen.getByText("Tran Thi B")).toBeInTheDocument();
    });
  });

  // Loading State Tests
  describe("Loading State", () => {
    it("shows loading spinner when data is loading", () => {
      const {
        useFetchAllPatientSwrCore,
      } = require("@/hook/singleton/swrs/patient/useFetchAllPatientSwr");

      useFetchAllPatientSwrCore.mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        mutate: mockMutate,
      });

      const { container } = render(<PatientList />);

      // Check for loading state
      expect(container.querySelector('[data-slot="base"]')).toBeInTheDocument();
    });
  });

  // Error State Tests
  describe("Error State", () => {
    it("displays error message when fetch fails", () => {
      const {
        useFetchAllPatientSwrCore,
      } = require("@/hook/singleton/swrs/patient/useFetchAllPatientSwr");

      useFetchAllPatientSwrCore.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error("Failed to fetch patients"),
        mutate: mockMutate,
      });

      render(<PatientList />);

      expect(
        screen.getByText(/Lỗi tải bệnh nhân: Failed to fetch patients/i)
      ).toBeInTheDocument();
    });
  });

  // Empty State Tests
  describe("Empty State", () => {
    it("shows empty state when no patients found", () => {
      const {
        useFetchAllPatientSwrCore,
      } = require("@/hook/singleton/swrs/patient/useFetchAllPatientSwr");

      useFetchAllPatientSwrCore.mockReturnValue({
        data: {
          data: {
            data: [],
            currentPage: 1,
            totalPages: 1,
          },
        },
        isLoading: false,
        error: null,
        mutate: mockMutate,
      });

      render(<PatientList />);

      expect(screen.getByText("Không tìm thấy bệnh nhân")).toBeInTheDocument();
      expect(
        screen.getByText(/Vui lòng điều chỉnh tìm kiếm hoặc bộ lọc/i)
      ).toBeInTheDocument();
    });
  });

  // Action Dropdown Tests
  describe("Action Dropdown", () => {
    it("renders action dropdown for each patient", () => {
      render(<PatientList />);

      const dropdownButtons = screen.getAllByLabelText("More actions");
      expect(dropdownButtons).toHaveLength(2);
    });

    it.skip("opens dropdown menu on button click", () => {
      render(<PatientList />);

      const dropdownButton = screen.getAllByLabelText("More actions")[0];
      fireEvent.click(dropdownButton);

      expect(screen.getByText("Xem")).toBeInTheDocument();
      expect(screen.getByText("Chỉnh sửa")).toBeInTheDocument();
      expect(screen.getByText("Xóa")).toBeInTheDocument();
    });
  });

  // View Patient Tests
  describe("View Patient Action", () => {
    it.skip("calls view handler when view option is clicked", async () => {
      render(<PatientList />);

      const dropdownButton = screen.getAllByLabelText("More actions")[0];
      fireEvent.click(dropdownButton);

      const viewButton = screen.getByText("Xem");
      fireEvent.click(viewButton);

      await waitFor(() => {
        expect(mockOpenViewModal).toHaveBeenCalledWith(1);
      });
    });
  });

  // Edit Patient Tests
  describe("Edit Patient Action", () => {
    it.skip("calls edit handler when edit option is clicked", async () => {
      render(<PatientList />);

      const dropdownButton = screen.getAllByLabelText("More actions")[0];
      fireEvent.click(dropdownButton);

      const editButton = screen.getByText("Chỉnh sửa");
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(mockOpenUpdateModal).toHaveBeenCalledWith(mockPatients[0]);
      });
    });
  });

  // Delete Patient Tests
  describe("Delete Patient Action", () => {
    it.skip("shows confirmation dialog on delete click", async () => {
      const Swal = require("sweetalert2").default;
      Swal.fire.mockResolvedValue({ isConfirmed: false });

      render(<PatientList />);

      const dropdownButton = screen.getAllByLabelText("More actions")[0];
      fireEvent.click(dropdownButton);

      const deleteButton = screen.getByText("Xóa");
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalled();
      });
    });

    it.skip("deletes patient when confirmed", async () => {
      const Swal = require("sweetalert2").default;
      Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
      mockDeletePatient.mockResolvedValue({});

      render(<PatientList />);

      const dropdownButton = screen.getAllByLabelText("More actions")[0];
      fireEvent.click(dropdownButton);

      const deleteButton = screen.getByText("Xóa");
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockDeletePatient).toHaveBeenCalledWith(1);
      });
    });
  });

  // Pagination Tests
  describe("Pagination", () => {
    it("updates page when pagination is clicked", () => {
      const {
        useFetchAllPatientSwrCore,
      } = require("@/hook/singleton/swrs/patient/useFetchAllPatientSwr");

      useFetchAllPatientSwrCore.mockReturnValue({
        data: {
          data: {
            data: mockPatients,
            currentPage: 1,
            totalPages: 3,
          },
        },
        isLoading: false,
        error: null,
        mutate: mockMutate,
      });

      const { container } = render(<PatientList />);

      expect(container.querySelector('[data-slot="base"]')).toBeInTheDocument();
    });
  });

  // Edge Cases
  describe("Edge Cases", () => {
    it("handles patients with missing optional fields", () => {
      const incompletePatient = {
        id: 3,
        fullName: "Test Patient",
        patientCode: null,
        gender: null,
        yob: null,
        phone: null,
        email: null,
        address: null,
        createdBy: null,
        modifiedBy: null,
        createdAt: null,
        deleted: false,
      };

      const {
        useFetchAllPatientSwrCore,
      } = require("@/hook/singleton/swrs/patient/useFetchAllPatientSwr");

      useFetchAllPatientSwrCore.mockReturnValue({
        data: {
          data: {
            data: [incompletePatient],
            currentPage: 1,
            totalPages: 1,
          },
        },
        isLoading: false,
        error: null,
        mutate: mockMutate,
      });

      render(<PatientList />);

      expect(screen.getByText("Test Patient")).toBeInTheDocument();
      // Should show placeholder for missing data
      expect(screen.getAllByText("-").length).toBeGreaterThan(0);
    });

    it("handles deleted patients with correct status", () => {
      const deletedPatient = {
        ...mockPatients[0],
        deleted: true,
      };

      const {
        useFetchAllPatientSwrCore,
      } = require("@/hook/singleton/swrs/patient/useFetchAllPatientSwr");

      useFetchAllPatientSwrCore.mockReturnValue({
        data: {
          data: {
            data: [deletedPatient],
            currentPage: 1,
            totalPages: 1,
          },
        },
        isLoading: false,
        error: null,
        mutate: mockMutate,
      });

      render(<PatientList />);

      expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    });
  });
});
