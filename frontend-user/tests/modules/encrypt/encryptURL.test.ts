import {
  decryptFromURL,
  encryptForURL,
  safeDecryptFromURL,
} from "@/modules/encrypt";

describe("encrypt URL functions", () => {
  const testValue = "test-data-123";
  const customSecret = "custom-test-secret-key-456";

  describe("encryptForURL", () => {
    it("should encrypt and URL encode a value", () => {
      const encrypted = encryptForURL(testValue);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(testValue);
      // Should be URL encoded (no special characters like +, /, =)
      expect(encrypted).toMatch(/^[A-Za-z0-9%\-_.~]*$/);
    });

    it("should encrypt numbers for URL", () => {
      const encrypted = encryptForURL(12345);
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe("string");
    });

    it("should use custom secret key", () => {
      const encrypted1 = encryptForURL(testValue);
      const encrypted2 = encryptForURL(testValue, customSecret);
      expect(encrypted1).not.toBe(encrypted2);
    });

    it("should produce URL-safe output", () => {
      const encrypted = encryptForURL(
        "test with spaces and special chars !@#$"
      );
      // All characters should be URL safe
      expect(encrypted).toMatch(/^[A-Za-z0-9%\-_.~]*$/);
    });
  });

  describe("decryptFromURL", () => {
    it("should decrypt URL-encoded encrypted value", () => {
      const encrypted = encryptForURL(testValue);
      const decrypted = decryptFromURL(encrypted);
      expect(decrypted).toBe(testValue);
    });

    it("should decrypt with custom secret key", () => {
      const encrypted = encryptForURL(testValue, customSecret);
      const decrypted = decryptFromURL(encrypted, customSecret);
      expect(decrypted).toBe(testValue);
    });

    it("should handle complex strings", () => {
      const complexString = "test@email.com?param=value&data=123";
      const encrypted = encryptForURL(complexString);
      const decrypted = decryptFromURL(encrypted);
      expect(decrypted).toBe(complexString);
    });

    it("should throw error for invalid encrypted data", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      expect(() => decryptFromURL("invalid-data")).toThrow();

      consoleSpy.mockRestore();
    });

    it("should throw error when wrong secret key is used", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const encrypted = encryptForURL(testValue);
      expect(() => decryptFromURL(encrypted, "wrong-key")).toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe("safeDecryptFromURL", () => {
    it("should safely decrypt valid encrypted value", () => {
      const encrypted = encryptForURL(testValue);
      const decrypted = safeDecryptFromURL(encrypted);
      expect(decrypted).toBe(testValue);
    });

    it("should return null for invalid encrypted data", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = safeDecryptFromURL("invalid-data");
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });

    it("should return null when wrong secret key is used", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const encrypted = encryptForURL(testValue, customSecret);
      const result = safeDecryptFromURL(encrypted, "wrong-key");
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });

    it("should handle empty string gracefully", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = safeDecryptFromURL("");
      expect(result).toBeNull();

      consoleSpy.mockRestore();
    });

    it("should work with custom secret key", () => {
      const encrypted = encryptForURL(testValue, customSecret);
      const decrypted = safeDecryptFromURL(encrypted, customSecret);
      expect(decrypted).toBe(testValue);
    });

    it("should not throw errors for malformed data", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      expect(() => safeDecryptFromURL("malformed%20data")).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe("encryptForURL and decryptFromURL integration", () => {
    it("should handle round-trip encryption/decryption", () => {
      const values = [
        "simple",
        "with spaces",
        "special!@#$%chars",
        "123456789",
        "email@example.com",
      ];

      values.forEach((value) => {
        const encrypted = encryptForURL(value);
        const decrypted = decryptFromURL(encrypted);
        expect(decrypted).toBe(value);
      });
    });

    it("should handle Unicode characters", () => {
      const unicodeText = "Xin chào! こんにちは 你好";
      const encrypted = encryptForURL(unicodeText);
      const decrypted = decryptFromURL(encrypted);
      expect(decrypted).toBe(unicodeText);
    });
  });
});
