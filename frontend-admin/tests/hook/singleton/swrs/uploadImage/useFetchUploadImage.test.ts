import { renderHook } from "@testing-library/react";

import { useFetchUploadImgCore } from "@/hook/singleton/swrs/uploadImage/useFetchUploadImage";

global.fetch = jest.fn();

describe("useFetchUploadImgCore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFetchUploadImgCore());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.uploadImage).toBeDefined();
  });

  it("should upload image successfully", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const mockUrl = "https://cloudinary.com/image.jpg";

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ secure_url: mockUrl }),
    });

    const { result } = renderHook(() => useFetchUploadImgCore());

    const url = await result.current.uploadImage(mockFile);

    expect(url).toBe(mockUrl);
  });

  it("should call fetch with correct parameters", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ secure_url: "https://cloudinary.com/image.jpg" }),
    });

    const { result } = renderHook(() => useFetchUploadImgCore());

    await result.current.uploadImage(mockFile);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("api.cloudinary.com"),
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      })
    );
  });

  it("should handle missing file error", async () => {
    const { result } = renderHook(() => useFetchUploadImgCore());

    await expect(
      result.current.uploadImage(null as unknown as File)
    ).rejects.toThrow("Missing file");
  });

  it("should handle upload failure", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const { result } = renderHook(() => useFetchUploadImgCore());

    await expect(result.current.uploadImage(mockFile)).rejects.toThrow(
      "Upload image failed"
    );
  });

  it("should handle network error", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

    (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useFetchUploadImgCore());

    await expect(result.current.uploadImage(mockFile)).rejects.toThrow(
      "Network error"
    );
  });

  it("should reset error on successful upload after previous error", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ secure_url: "https://cloudinary.com/image.jpg" }),
      });

    const { result } = renderHook(() => useFetchUploadImgCore());

    // First upload fails
    await expect(result.current.uploadImage(mockFile)).rejects.toThrow(
      "Upload image failed"
    );

    // Second upload succeeds
    const url = await result.current.uploadImage(mockFile);
    expect(url).toBe("https://cloudinary.com/image.jpg");
  });

  it("should complete upload and return URL", async () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const mockUrl = "https://cloudinary.com/image.jpg";

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ secure_url: mockUrl }),
    });

    const { result } = renderHook(() => useFetchUploadImgCore());

    const url = await result.current.uploadImage(mockFile);

    expect(url).toBe(mockUrl);
  });
});
