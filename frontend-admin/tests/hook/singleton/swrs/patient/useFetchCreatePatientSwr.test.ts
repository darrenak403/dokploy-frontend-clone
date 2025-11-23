import { act, renderHook } from "@testing-library/react";

import { postFetcher } from "@/libs/fetcher";

import { useFetchCreatePatientSwrCore } from "@/hook/singleton/swrs/patient/useFetchCreatePatientSwr";

jest.mock("@/libs/fetcher");
jest.mock("swr/mutation");

const mockTrigger = jest.fn();
const mockReset = jest.fn();

describe("useFetchCreatePatientSwrCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
      reset: mockReset,
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchCreatePatientSwrCore());

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
    expect(result.current.isMutating).toBe(false);
    expect(typeof result.current.createPatient).toBe("function");
  });

  it("should use default URL", () => {
    const useSWRMutation = require("swr/mutation").default;

    renderHook(() => useFetchCreatePatientSwrCore());

    expect(useSWRMutation).toHaveBeenCalledWith("/patient", postFetcher, {});
  });

  it("should call trigger when createPatient is invoked", async () => {
    const { result } = renderHook(() => useFetchCreatePatientSwrCore());

    const payload = {
      userId: 1,
      fullName: "New Patient",
      email: "new@example.com",
    };

    await act(async () => {
      await result.current.createPatient(payload);
    });

    expect(mockTrigger).toHaveBeenCalledWith(payload);
  });

  it("should return data when mutation succeeds", () => {
    const mockData = {
      status: 201,
      message: "Patient created",
      data: {
        id: 1,
        fullName: "New Patient",
        email: "new@example.com",
      },
    };

    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: mockData,
      error: undefined,
      isMutating: false,
      trigger: mockTrigger,
      reset: mockReset,
    });

    const { result } = renderHook(() => useFetchCreatePatientSwrCore());

    expect(result.current.data).toEqual(mockData);
  });

  it("should set isMutating to true during creation", () => {
    const useSWRMutation = require("swr/mutation").default;
    useSWRMutation.mockReturnValue({
      data: undefined,
      error: undefined,
      isMutating: true,
      trigger: mockTrigger,
      reset: mockReset,
    });

    const { result } = renderHook(() => useFetchCreatePatientSwrCore());

    expect(result.current.isMutating).toBe(true);
  });

  it("should call reset function", async () => {
    const { result } = renderHook(() => useFetchCreatePatientSwrCore());

    await act(async () => {
      await result.current.reset();
    });

    expect(mockReset).toHaveBeenCalled();
  });
});
