import axios, { AxiosInstance } from "axios";

import {
  deleteFetcher,
  fetcher,
  patchFetcher,
  postFetcher,
  putFetcher,
} from "@/libs/fetcher";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Fetcher Utility Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetcher", () => {
    it("makes GET request and returns data", async () => {
      const mockResponse = { data: { success: true } };
      const mockInstance = {
        get: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      } as unknown as AxiosInstance;

      mockedAxios.create.mockReturnValue(mockInstance);

      const result = await fetcher("/test");
      expect(result).toEqual({ success: true });
      expect(mockInstance.get).toHaveBeenCalledWith("/test");
    });

    it("throws error on request failure", async () => {
      const mockInstance = {
        get: jest.fn().mockRejectedValue(new Error("Network error")),
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      } as unknown as AxiosInstance;

      mockedAxios.create.mockReturnValue(mockInstance);

      await expect(fetcher("/test")).rejects.toThrow("Network error");
    });
  });

  describe("postFetcher", () => {
    it("makes POST request with body and returns data", async () => {
      const mockResponse = { data: { success: true } };
      const mockInstance = {
        post: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      } as unknown as AxiosInstance;

      mockedAxios.create.mockReturnValue(mockInstance);

      const result = await postFetcher("/test", { arg: { name: "test" } });
      expect(result).toEqual({ success: true });
      expect(mockInstance.post).toHaveBeenCalledWith("/test", { name: "test" });
    });
  });

  describe("putFetcher", () => {
    it("makes PUT request with body and returns data", async () => {
      const mockResponse = { data: { success: true } };
      const mockInstance = {
        put: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      } as unknown as AxiosInstance;

      mockedAxios.create.mockReturnValue(mockInstance);

      const result = await putFetcher("/test", { arg: { name: "test" } });
      expect(result).toEqual({ success: true });
      expect(mockInstance.put).toHaveBeenCalledWith("/test", { name: "test" });
    });
  });

  describe("patchFetcher", () => {
    it("makes PATCH request with body and returns data", async () => {
      const mockResponse = { data: { success: true } };
      const mockInstance = {
        patch: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      } as unknown as AxiosInstance;

      mockedAxios.create.mockReturnValue(mockInstance);

      const result = await patchFetcher("/test", { arg: { name: "test" } });
      expect(result).toEqual({ success: true });
      expect(mockInstance.patch).toHaveBeenCalledWith("/test", {
        name: "test",
      });
    });
  });

  describe("deleteFetcher", () => {
    it("makes DELETE request and returns data", async () => {
      const mockResponse = { data: { success: true } };
      const mockInstance = {
        delete: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      } as unknown as AxiosInstance;

      mockedAxios.create.mockReturnValue(mockInstance);

      const result = await deleteFetcher("/test");
      expect(result).toEqual({ success: true });
      expect(mockInstance.delete).toHaveBeenCalledWith("/test", {});
    });
  });
});
