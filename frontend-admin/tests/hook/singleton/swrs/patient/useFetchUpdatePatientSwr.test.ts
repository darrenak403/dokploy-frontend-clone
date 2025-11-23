import { renderHook } from "@testing-library/react";

import { useFetchUpdatePatientSwrCore } from "@/hook/singleton/swrs/patient/useFetchUpdatePatientSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");

const mockTrigger = jest.fn();

describe("useFetchUpdatePatientSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: false,
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchUpdatePatientSwrCore(123));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.updatePatient).toBeDefined();
  });

  it("should use initialId when not provided in trigger", async () => {
    const { result } = renderHook(() => useFetchUpdatePatientSwrCore(123));

    await result.current.updatePatient({
      payload: {
        userId: 1,
        fullName: "Test Patient",
        yob: "1990",
        gender: "Male",
        address: "123 Test St",
        phone: "123456789",
        email: "test@example.com",
      },
    });

    expect(mockTrigger).toHaveBeenCalledWith({
      payload: expect.objectContaining({ fullName: "Test Patient" }),
    });
  });

  it("should accept id in trigger argument", async () => {
    const { result } = renderHook(() => useFetchUpdatePatientSwrCore(null));

    await result.current.updatePatient({
      id: 456,
      payload: {
        userId: 2,
        fullName: "Updated Patient",
        yob: "1985",
        gender: "Female",
        address: "456 Update Ave",
        phone: "987654321",
        email: "updated@example.com",
      },
    });

    expect(mockTrigger).toHaveBeenCalledWith({
      id: 456,
      payload: expect.objectContaining({ fullName: "Updated Patient" }),
    });
  });

  it("should return data on successful update", () => {
    const mockData = {
      statusCode: 200,
      message: "Patient updated successfully",
      data: {
        id: 123,
        userId: 1,
        fullName: "Test Patient",
        yob: "1990",
        gender: "Male",
        address: "123 Test St",
        phone: "123456789",
        email: "test@example.com",
      },
    };

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: mockData,
      error: undefined,
      isMutating: false,
    });

    const { result } = renderHook(() => useFetchUpdatePatientSwrCore(123));

    expect(result.current.data).toEqual(mockData);
  });

  it("should return error on failed update", () => {
    const mockError = new Error("Failed to update patient");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: mockError,
      isMutating: false,
    });

    const { result } = renderHook(() => useFetchUpdatePatientSwrCore(123));

    expect(result.current.error).toEqual(mockError);
  });

  it("should show isMutating during update", () => {
    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: true,
    });

    const { result } = renderHook(() => useFetchUpdatePatientSwrCore(123));

    expect(result.current.isMutating).toBe(true);
  });

  it("should accept custom options", () => {
    const useSWRMutation = require("swr/mutation").default;
    const customOptions = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() => useFetchUpdatePatientSwrCore(123, customOptions));

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/patient/{id}",
      expect.any(Function),
      customOptions
    );
  });
});
