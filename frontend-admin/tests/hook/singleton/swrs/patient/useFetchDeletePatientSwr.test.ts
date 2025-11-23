import { renderHook } from "@testing-library/react";

import { useFetchDeletePatientSwrCore } from "@/hook/singleton/swrs/patient/useFetchDeletePatientSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");

const mockTrigger = jest.fn();

describe("useFetchDeletePatientSwrCore", () => {
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
    const { result } = renderHook(() => useFetchDeletePatientSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(result.current.deletePatient).toBeDefined();
  });

  it("should use default URL with {id} placeholder", () => {
    const useSWRMutation = require("swr/mutation").default;

    renderHook(() => useFetchDeletePatientSwrCore());

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/patient/{id}",
      expect.any(Function),
      undefined
    );
  });

  it("should call deletePatient with numeric id", async () => {
    const { result } = renderHook(() => useFetchDeletePatientSwrCore());

    await result.current.deletePatient(123);

    expect(mockTrigger).toHaveBeenCalledWith(123);
  });

  it("should call deletePatient with object containing id", async () => {
    const { result } = renderHook(() => useFetchDeletePatientSwrCore());

    await result.current.deletePatient({ id: 456 });

    expect(mockTrigger).toHaveBeenCalledWith({ id: 456 });
  });

  it("should return data on successful deletion", () => {
    const mockData = {
      status: 200,
      message: "Patient deleted successfully",
      data: null,
    };

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: mockData,
      error: undefined,
      isMutating: false,
    });

    const { result } = renderHook(() => useFetchDeletePatientSwrCore());

    expect(result.current.data).toEqual(mockData);
  });

  it("should return error on failed deletion", () => {
    const mockError = new Error("Failed to delete patient");

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: mockError,
      isMutating: false,
    });

    const { result } = renderHook(() => useFetchDeletePatientSwrCore());

    expect(result.current.error).toEqual(mockError);
  });

  it("should show isMutating during deletion", () => {
    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      trigger: mockTrigger,
      data: undefined,
      error: undefined,
      isMutating: true,
    });

    const { result } = renderHook(() => useFetchDeletePatientSwrCore());

    expect(result.current.isMutating).toBe(true);
  });

  it("should accept custom options", () => {
    const useSWRMutation = require("swr/mutation").default;
    const customOptions = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };

    renderHook(() =>
      useFetchDeletePatientSwrCore("/patient/{id}", customOptions)
    );

    expect(useSWRMutation).toHaveBeenCalledWith(
      "/patient/{id}",
      expect.any(Function),
      customOptions
    );
  });
});
