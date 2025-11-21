/**
 * @jest-environment jsdom
 */
import { createImage } from "@/modules/CropImage";
import getCroppedImg, { colors } from "@/modules/CropImage";

describe("CropImage Module", () => {
  // Mock canvas and Image
  beforeAll(() => {
    // Mock HTMLCanvasElement
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      drawImage: jest.fn(),
      canvas: {
        width: 0,
        height: 0,
      },
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    HTMLCanvasElement.prototype.toBlob = jest.fn((callback) => {
      const blob = new Blob(["fake-image-data"], { type: "image/jpeg" });
      callback(blob);
    });
  });

  describe("createImage", () => {
    it("should create an image from a valid URL", async () => {
      const mockUrl = "https://example.com/image.jpg";

      // Mock Image constructor
      const mockImage = {
        addEventListener: jest.fn((event, handler) => {
          if (event === "load") {
            setTimeout(() => handler(), 0);
          }
        }),
        setAttribute: jest.fn(),
        src: "",
      };

      global.Image = jest.fn(() => mockImage) as unknown as typeof Image;

      const promise = createImage(mockUrl);

      await expect(promise).resolves.toBeDefined();
      expect(mockImage.setAttribute).toHaveBeenCalledWith(
        "crossOrigin",
        "anonymous"
      );
      expect(mockImage.src).toBe(mockUrl);
    });

    it("should reject on image load error", async () => {
      const mockUrl = "https://example.com/invalid-image.jpg";
      const mockError = new Error("Failed to load image");

      const mockImage = {
        addEventListener: jest.fn((event, handler) => {
          if (event === "error") {
            setTimeout(() => handler(mockError), 0);
          }
        }),
        setAttribute: jest.fn(),
        src: "",
      };

      global.Image = jest.fn(() => mockImage) as unknown as typeof Image;

      await expect(createImage(mockUrl)).rejects.toBe(mockError);
    });

    it("should set crossOrigin attribute to anonymous", async () => {
      const mockUrl = "https://example.com/image.jpg";

      const mockImage = {
        addEventListener: jest.fn((event, handler) => {
          if (event === "load") {
            setTimeout(() => handler(), 0);
          }
        }),
        setAttribute: jest.fn(),
        src: "",
      };

      global.Image = jest.fn(() => mockImage) as unknown as typeof Image;

      await createImage(mockUrl);

      expect(mockImage.setAttribute).toHaveBeenCalledWith(
        "crossOrigin",
        "anonymous"
      );
    });
  });

  describe("getCroppedImg", () => {
    const mockImageSrc =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const mockPixelCrop = {
      x: 10,
      y: 10,
      width: 100,
      height: 100,
    };

    beforeEach(() => {
      // Mock document.createElement for canvas
      const mockCanvas = {
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback) => {
          const blob = new Blob(["fake-image-data"], { type: "image/jpeg" });
          callback(blob);
        }),
        width: 0,
        height: 0,
      };

      jest
        .spyOn(document, "createElement")
        .mockReturnValue(mockCanvas as unknown as HTMLCanvasElement);
    });

    it("should crop image and return File object", async () => {
      // Mock createImage to return a valid HTMLImageElement
      const mockImage = {
        width: 200,
        height: 200,
        addEventListener: jest.fn((event, handler) => {
          if (event === "load") {
            setTimeout(() => handler(), 0);
          }
        }),
        setAttribute: jest.fn(),
        src: "",
      };

      global.Image = jest.fn(() => mockImage) as unknown as typeof Image;

      const result = await getCroppedImg(mockImageSrc, mockPixelCrop);

      expect(result).toBeInstanceOf(File);
      expect(result?.name).toBe("avatar.jpg");
      expect(result?.type).toBe("image/jpeg");
    });

    it("should set canvas dimensions to crop area size", async () => {
      const mockImage = {
        width: 200,
        height: 200,
        addEventListener: jest.fn((event, handler) => {
          if (event === "load") {
            setTimeout(() => handler(), 0);
          }
        }),
        setAttribute: jest.fn(),
        src: "",
      };

      global.Image = jest.fn(() => mockImage) as unknown as typeof Image;

      const mockCanvas = {
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback) => {
          const blob = new Blob(["fake-image-data"], { type: "image/jpeg" });
          callback(blob);
        }),
        width: 0,
        height: 0,
      };

      jest
        .spyOn(document, "createElement")
        .mockReturnValue(mockCanvas as unknown as HTMLCanvasElement);

      await getCroppedImg(mockImageSrc, mockPixelCrop);

      expect(mockCanvas.width).toBe(mockPixelCrop.width);
      expect(mockCanvas.height).toBe(mockPixelCrop.height);
    });

    it("should throw error if canvas context is not available", async () => {
      const mockImage = {
        addEventListener: jest.fn((event, handler) => {
          if (event === "load") {
            setTimeout(() => handler(), 0);
          }
        }),
        setAttribute: jest.fn(),
        src: "",
      };

      global.Image = jest.fn(() => mockImage) as unknown as typeof Image;

      const mockCanvas = {
        getContext: jest.fn(() => null),
        toBlob: jest.fn(),
      };

      jest
        .spyOn(document, "createElement")
        .mockReturnValue(mockCanvas as unknown as HTMLCanvasElement);

      await expect(getCroppedImg(mockImageSrc, mockPixelCrop)).rejects.toThrow(
        "Không thể lấy context của canvas"
      );
    });

    it("should return null if toBlob returns null", async () => {
      const mockImage = {
        addEventListener: jest.fn((event, handler) => {
          if (event === "load") {
            setTimeout(() => handler(), 0);
          }
        }),
        setAttribute: jest.fn(),
        src: "",
      };

      global.Image = jest.fn(() => mockImage) as unknown as typeof Image;

      const mockCanvas = {
        getContext: jest.fn(() => ({
          drawImage: jest.fn(),
        })),
        toBlob: jest.fn((callback) => {
          callback(null);
        }),
        width: 0,
        height: 0,
      };

      jest
        .spyOn(document, "createElement")
        .mockReturnValue(mockCanvas as unknown as HTMLCanvasElement);

      const result = await getCroppedImg(mockImageSrc, mockPixelCrop);

      expect(result).toBeNull();
    });

    it("should call drawImage with correct parameters", async () => {
      const mockDrawImage = jest.fn();
      const mockImage = {
        addEventListener: jest.fn((event, handler) => {
          if (event === "load") {
            setTimeout(() => handler(), 0);
          }
        }),
        setAttribute: jest.fn(),
        src: "",
      };

      global.Image = jest.fn(() => mockImage) as unknown as typeof Image;

      const mockCanvas = {
        getContext: jest.fn(() => ({
          drawImage: mockDrawImage,
        })),
        toBlob: jest.fn((callback) => {
          const blob = new Blob(["fake-image-data"], { type: "image/jpeg" });
          callback(blob);
        }),
        width: 0,
        height: 0,
      };

      jest
        .spyOn(document, "createElement")
        .mockReturnValue(mockCanvas as unknown as HTMLCanvasElement);

      await getCroppedImg(mockImageSrc, mockPixelCrop);

      expect(mockDrawImage).toHaveBeenCalledWith(
        mockImage,
        mockPixelCrop.x,
        mockPixelCrop.y,
        mockPixelCrop.width,
        mockPixelCrop.height,
        0,
        0,
        mockPixelCrop.width,
        mockPixelCrop.height
      );
    });
  });

  describe("colors constant", () => {
    it("should export colors array", () => {
      expect(colors).toBeDefined();
      expect(Array.isArray(colors)).toBe(true);
      expect(colors).toContain("primary");
      expect(colors).toContain("secondary");
      expect(colors).toContain("success");
      expect(colors).toContain("warning");
      expect(colors).toContain("danger");
    });
  });
});
