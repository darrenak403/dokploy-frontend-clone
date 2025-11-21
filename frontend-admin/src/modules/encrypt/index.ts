import CryptoJS from "crypto-js";

const SECRET = process.env.NEXT_PUBLIC_SECRET || "";

/**
 * Encrypt a string value using AES encryption
 * @param value - The value to encrypt
 * @param secretKey - Optional custom secret key (default: env SECRET)
 * @returns Encrypted string
 */
export const encryptValue = (
  value: string | number,
  secretKey?: string
): string => {
  const key = secretKey || SECRET;

  if (!key) {
    throw new Error("Encryption key is not configured");
  }

  try {
    const stringValue = String(value);
    const encrypted = CryptoJS.AES.encrypt(stringValue, key).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt value");
  }
};

/**
 * Decrypt an encrypted string value
 * @param encryptedValue - The encrypted value to decrypt
 * @param secretKey - Optional custom secret key (default: env SECRET)
 * @returns Decrypted string
 */
export const decryptValue = (
  encryptedValue: string,
  secretKey?: string
): string => {
  const key = secretKey || SECRET;

  if (!key) {
    throw new Error("Decryption key is not configured");
  }

  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedValue, key).toString(
      CryptoJS.enc.Utf8
    );

    if (!decrypted) {
      throw new Error("Decryption returned empty string");
    }

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt value");
  }
};

/**
 * Encrypt value for URL parameter (includes URL encoding)
 * @param value - The value to encrypt
 * @param secretKey - Optional custom secret key
 * @returns URL-safe encrypted string
 */
export const encryptForURL = (
  value: string | number,
  secretKey?: string
): string => {
  const encrypted = encryptValue(value, secretKey);
  return encodeURIComponent(encrypted);
};

/**
 * Decrypt value from URL parameter (includes URL decoding)
 * @param encryptedValue - The URL-encoded encrypted value
 * @param secretKey - Optional custom secret key
 * @returns Decrypted string
 */
export const decryptFromURL = (
  encryptedValue: string,
  secretKey?: string
): string => {
  const decoded = decodeURIComponent(encryptedValue);
  return decryptValue(decoded, secretKey);
};

/**
 * Safe decrypt from URL - returns null instead of throwing error
 * Useful for optional decryption or fallback scenarios
 * @param encryptedValue - The URL-encoded encrypted value
 * @param secretKey - Optional custom secret key
 * @returns Decrypted string or null if failed
 */
export const safeDecryptFromURL = (
  encryptedValue: string,
  secretKey?: string
): string | null => {
  try {
    return decryptFromURL(encryptedValue, secretKey);
  } catch (error) {
    console.error("Safe decrypt failed:", error);
    return null;
  }
};
