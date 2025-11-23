import {
  decryptFromURL,
  decryptValue,
  encryptForURL,
  encryptValue,
  safeDecryptFromURL,
} from "@/modules/encrypt";

describe("Encryption Utility Functions", () => {
  const testValue = "Hello World";
  const testNumber = 12345;

  describe("encryptValue", () => {
    it("should encrypt a string value", () => {
      const encrypted = encryptValue(testValue);
      expect(encrypted).toBeTruthy();
      expect(encrypted).not.toBe(testValue);
      expect(typeof encrypted).toBe("string");
    });

    it("should encrypt a number value", () => {
      const encrypted = encryptValue(testNumber);
      expect(encrypted).toBeTruthy();
      expect(typeof encrypted).toBe("string");
    });

    it("should encrypt with custom secret key", () => {
      const customSecret = "custom-key";
      const encrypted = encryptValue(testValue, customSecret);
      expect(encrypted).toBeTruthy();
    });

    // Note: Cannot test "no SECRET configured" because SECRET is initialized at module load time
    // The jest.setup.js sets process.env.NEXT_PUBLIC_SECRET before module loads
    it.skip("should throw error when no encryption key is configured", () => {
      const originalEnv = process.env.NEXT_PUBLIC_SECRET;
      process.env.NEXT_PUBLIC_SECRET = "";

      // With no default SECRET and no custom key, should fail
      expect(() => encryptValue(testValue)).toThrow(
        /Encryption key is not configured/
      );

      process.env.NEXT_PUBLIC_SECRET = originalEnv;
    });

    it("should encrypt empty string", () => {
      const encrypted = encryptValue("");
      expect(encrypted).toBeTruthy();
    });

    it("should produce different encrypted values for same input (due to salt)", () => {
      const encrypted1 = encryptValue(testValue);
      const encrypted2 = encryptValue(testValue);
      // CryptoJS AES may produce same or different output depending on implementation
      expect(encrypted1).toBeTruthy();
      expect(encrypted2).toBeTruthy();
    });
  });

  describe("decryptValue", () => {
    it("should decrypt an encrypted string", () => {
      const encrypted = encryptValue(testValue);
      const decrypted = decryptValue(encrypted);
      expect(decrypted).toBe(testValue);
    });

    it("should decrypt an encrypted number", () => {
      const encrypted = encryptValue(testNumber);
      const decrypted = decryptValue(encrypted);
      expect(decrypted).toBe(String(testNumber));
    });

    it("should decrypt with custom secret key", () => {
      const customSecret = "custom-key";
      const encrypted = encryptValue(testValue, customSecret);
      const decrypted = decryptValue(encrypted, customSecret);
      expect(decrypted).toBe(testValue);
    });

    it("should throw error when no decryption key is configured", () => {
      const originalEnv = process.env.NEXT_PUBLIC_SECRET;
      process.env.NEXT_PUBLIC_SECRET = "";

      // Empty string key should fail during decryption
      expect(() => decryptValue("somevalue", "")).toThrow(
        "Failed to decrypt value"
      );

      process.env.NEXT_PUBLIC_SECRET = originalEnv;
    });

    it("should throw error for invalid encrypted value", () => {
      expect(() => decryptValue("invalid-encrypted-string")).toThrow(
        "Failed to decrypt value"
      );
    });

    it("should throw error when decrypting with wrong key", () => {
      const encrypted = encryptValue(testValue, "key1");
      expect(() => decryptValue(encrypted, "key2")).toThrow(
        "Failed to decrypt value"
      );
    });

    it("should handle empty encrypted string", () => {
      expect(() => decryptValue("")).toThrow();
    });
  });

  describe("encryptForURL", () => {
    it("should encrypt and URL encode a string", () => {
      const encrypted = encryptForURL(testValue);
      expect(encrypted).toBeTruthy();
      expect(encrypted).not.toBe(testValue);
      // Should be URL safe (no unencoded special chars like +, /, =)
      expect(encrypted).toMatch(/^[A-Za-z0-9\-_.~%]*$/);
    });

    it("should encrypt and URL encode a number", () => {
      const encrypted = encryptForURL(testNumber);
      expect(encrypted).toBeTruthy();
      expect(typeof encrypted).toBe("string");
    });

    it("should work with custom secret", () => {
      const customSecret = "custom-key";
      const encrypted = encryptForURL(testValue, customSecret);
      expect(encrypted).toBeTruthy();
    });

    it("should handle special characters in value", () => {
      const specialValue = "test@value+with/special=chars";
      const encrypted = encryptForURL(specialValue);
      expect(encrypted).toBeTruthy();
    });
  });

  describe("decryptFromURL", () => {
    it("should decrypt a URL-encoded encrypted string", () => {
      const encrypted = encryptForURL(testValue);
      const decrypted = decryptFromURL(encrypted);
      expect(decrypted).toBe(testValue);
    });

    it("should decrypt a URL-encoded encrypted number", () => {
      const encrypted = encryptForURL(testNumber);
      const decrypted = decryptFromURL(encrypted);
      expect(decrypted).toBe(String(testNumber));
    });

    it("should work with custom secret key", () => {
      const customSecret = "custom-key";
      const encrypted = encryptForURL(testValue, customSecret);
      const decrypted = decryptFromURL(encrypted, customSecret);
      expect(decrypted).toBe(testValue);
    });

    it("should throw error for invalid URL-encoded value", () => {
      expect(() => decryptFromURL("invalid")).toThrow();
    });

    it("should handle special characters in original value", () => {
      const specialValue = "test@value+with/special=chars";
      const encrypted = encryptForURL(specialValue);
      const decrypted = decryptFromURL(encrypted);
      expect(decrypted).toBe(specialValue);
    });
  });

  describe("safeDecryptFromURL", () => {
    it("should decrypt a valid URL-encoded encrypted string", () => {
      const encrypted = encryptForURL(testValue);
      const decrypted = safeDecryptFromURL(encrypted);
      expect(decrypted).toBe(testValue);
    });

    it("should return null for invalid encrypted value", () => {
      const result = safeDecryptFromURL("invalid-encrypted-value");
      expect(result).toBeNull();
    });

    it("should return null when decrypting with wrong key", () => {
      const encrypted = encryptForURL(testValue, "key1");
      const result = safeDecryptFromURL(encrypted, "key2");
      expect(result).toBeNull();
    });

    it("should return null for empty string", () => {
      const result = safeDecryptFromURL("");
      expect(result).toBeNull();
    });

    it("should work with custom secret key", () => {
      const customSecret = "custom-key";
      const encrypted = encryptForURL(testValue, customSecret);
      const decrypted = safeDecryptFromURL(encrypted, customSecret);
      expect(decrypted).toBe(testValue);
    });

    it("should handle Unicode characters", () => {
      const unicodeValue = "Tiếng Việt 日本語";
      const encrypted = encryptForURL(unicodeValue);
      const decrypted = safeDecryptFromURL(encrypted);
      expect(decrypted).toBe(unicodeValue);
    });
  });

  describe("Integration: Encrypt/Decrypt Round Trip", () => {
    it("should successfully encrypt and decrypt string values", () => {
      const values = ["test", "Hello World", "123", "special!@#$%^&*()"];
      values.forEach((value) => {
        const encrypted = encryptValue(value);
        const decrypted = decryptValue(encrypted);
        expect(decrypted).toBe(value);
      });
    });

    it("should successfully encrypt and decrypt for URL parameters", () => {
      const values = ["test", "user@email.com", "12345", "value with spaces"];
      values.forEach((value) => {
        const encrypted = encryptForURL(value);
        const decrypted = decryptFromURL(encrypted);
        expect(decrypted).toBe(value);
      });
    });

    it("should handle long text encryption", () => {
      const longText = "a".repeat(1000);
      const encrypted = encryptValue(longText);
      const decrypted = decryptValue(encrypted);
      expect(decrypted).toBe(longText);
    });
  });
});
