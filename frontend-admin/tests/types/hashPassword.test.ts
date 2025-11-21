import { hashPasswordSHA256 } from "@/types/hashPassword";

describe("hashPasswordSHA256", () => {
  it("should hash a password using SHA256", async () => {
    const password = "mySecurePassword123";
    const hashed = await hashPasswordSHA256(password);

    expect(hashed).toBeTruthy();
    expect(typeof hashed).toBe("string");
    expect(hashed).not.toBe(password);
    expect(hashed.length).toBe(64); // SHA256 produces 64 character hex string
  });

  it("should produce consistent hash for same password", async () => {
    const password = "testPassword";
    const hash1 = await hashPasswordSHA256(password);
    const hash2 = await hashPasswordSHA256(password);

    expect(hash1).toBe(hash2);
  });

  it("should produce different hashes for different passwords", async () => {
    const password1 = "password1";
    const password2 = "password2";
    const hash1 = await hashPasswordSHA256(password1);
    const hash2 = await hashPasswordSHA256(password2);

    expect(hash1).not.toBe(hash2);
  });

  it("should handle empty string", async () => {
    const hashed = await hashPasswordSHA256("");
    expect(hashed).toBeTruthy();
    expect(hashed.length).toBe(64);
  });

  it("should handle special characters", async () => {
    const password = "p@$$w0rd!#%&*()";
    const hashed = await hashPasswordSHA256(password);

    expect(hashed).toBeTruthy();
    expect(hashed.length).toBe(64);
  });

  it("should handle Unicode characters", async () => {
    const password = "Mật khẩu 日本語";
    const hashed = await hashPasswordSHA256(password);

    expect(hashed).toBeTruthy();
    expect(hashed.length).toBe(64);
  });

  it("should handle long passwords", async () => {
    const password = "a".repeat(1000);
    const hashed = await hashPasswordSHA256(password);

    expect(hashed).toBeTruthy();
    expect(hashed.length).toBe(64);
  });

  it("should produce hash with only lowercase hex characters", async () => {
    const password = "TestPassword123";
    const hashed = await hashPasswordSHA256(password);

    expect(hashed).toMatch(/^[0-9a-f]{64}$/);
  });

  it("should handle numeric string password", async () => {
    const password = "12345678";
    const hashed = await hashPasswordSHA256(password);

    expect(hashed).toBeTruthy();
    expect(hashed.length).toBe(64);
  });

  it("should handle whitespace in password", async () => {
    const password = "  spaces  around  ";
    const hashed = await hashPasswordSHA256(password);

    expect(hashed).toBeTruthy();
    expect(hashed.length).toBe(64);
  });

  it("should produce different hash for password with different case", async () => {
    const password1 = "Password";
    const password2 = "password";
    const hash1 = await hashPasswordSHA256(password1);
    const hash2 = await hashPasswordSHA256(password2);

    expect(hash1).not.toBe(hash2);
  });
});
