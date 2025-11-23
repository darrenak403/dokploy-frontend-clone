import { renderHook } from "@testing-library/react";

import { useFetchPatientByAccessionNumberSwrCore } from "@/hook/singleton/swrs/test-order/useFetchPatientByAccessionNumberSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr");

const mockMutate = jest.fn();

describe("useFetchPatientByAccessionNumberSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() =>
      useFetchPatientByAccessionNumberSwrCore("ACC-001")
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.patientData).toBeUndefined();
  });

  it("should use correct URL with accession number", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchPatientByAccessionNumberSwrCore("ACC-123"));

    expect(useSWR).toHaveBeenCalledWith(
      "/orders/accessionNumber/patient/ACC-123",
      expect.any(Function),
      expect.objectContaining({
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      })
    );
  });

  it("should use null URL when accession number is null", () => {
    const useSWR = require("swr").default;

    renderHook(() => useFetchPatientByAccessionNumberSwrCore(null));

    expect(useSWR).toHaveBeenCalledWith(
      null,
      expect.any(Function),
      expect.any(Object)
    );
  });

  it("should return patient data", () => {
    const mockData = {
      status: 200,
      data: {
        id: 1,
        fullName: "John Doe",
        yob: "1990",
        gender: "Male",
        phone: "123456789",
      },
    };

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() =>
      useFetchPatientByAccessionNumberSwrCore("ACC-001")
    );

    expect(result.current.data).toEqual(mockData);
    expect(result.current.patientData).toEqual(mockData.data);
  });

  it("should return error on failed fetch", () => {
    const mockError = new Error("Patient not found");

    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() =>
      useFetchPatientByAccessionNumberSwrCore("ACC-001")
    );

    expect(result.current.error).toEqual(mockError);
  });

  it("should show loading state", () => {
    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: mockMutate,
      isValidating: false,
    });

    const { result } = renderHook(() =>
      useFetchPatientByAccessionNumberSwrCore("ACC-001")
    );

    expect(result.current.isLoading).toBe(true);
  });

  it("should show validating state", () => {
    const useSWR = require("swr").default;
    useSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: true,
    });

    const { result } = renderHook(() =>
      useFetchPatientByAccessionNumberSwrCore("ACC-001")
    );

    expect(result.current.isValidating).toBe(true);
  });

  it("should accept custom options", () => {
    const useSWR = require("swr").default;
    const customOptions = {
      refreshInterval: 5000,
    };

    renderHook(() =>
      useFetchPatientByAccessionNumberSwrCore("ACC-001", customOptions)
    );

    expect(useSWR).toHaveBeenCalledWith(
      "/orders/accessionNumber/patient/ACC-001",
      expect.any(Function),
      expect.objectContaining({
        refreshInterval: 5000,
      })
    );
  });
});
