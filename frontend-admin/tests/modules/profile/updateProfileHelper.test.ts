import {
  getGenderLabel,
  mapInputToGenderKey,
  validationUpdateUserSchema,
} from "@/modules/profile/updateProfileHelper";

describe("Profile Update Helper Functions", () => {
  describe("getGenderLabel", () => {
    it("should return Vietnamese label for male", () => {
      expect(getGenderLabel("male")).toBe("Nam");
      expect(getGenderLabel("Male")).toBe("Nam");
    });

    it("should return Vietnamese label for female", () => {
      expect(getGenderLabel("female")).toBe("Nữ");
    });

    it("should return Vietnamese label for other", () => {
      expect(getGenderLabel("other")).toBe("Khác");
    });

    it("should return empty string for undefined", () => {
      expect(getGenderLabel(undefined)).toBe("");
    });

    it("should return original value for unknown gender", () => {
      expect(getGenderLabel("unknown")).toBe("unknown");
    });
  });

  describe("mapInputToGenderKey", () => {
    it('should map Vietnamese male inputs to "male"', () => {
      expect(mapInputToGenderKey("nam")).toBe("male");
      expect(mapInputToGenderKey("n")).toBe("male");
      expect(mapInputToGenderKey("male")).toBe("male");
    });

    it('should map Vietnamese female inputs to "female"', () => {
      expect(mapInputToGenderKey("nữ")).toBe("female");
      expect(mapInputToGenderKey("nu")).toBe("female");
      expect(mapInputToGenderKey("female")).toBe("female");
    });

    it('should map Vietnamese other inputs to "other"', () => {
      expect(mapInputToGenderKey("khác")).toBe("other");
      expect(mapInputToGenderKey("khac")).toBe("other");
    });

    it("should return empty string for empty input", () => {
      expect(mapInputToGenderKey(undefined)).toBe("");
    });
  });

  describe("validationUpdateUserSchema", () => {
    it("should validate a valid profile update", async () => {
      const validData = {
        fullName: "Nguyen Van A",
        dateOfBirth: "01/01/2000",
        gender: "male",
        email: "test@example.com",
        phone: "0987654321",
        address: "123 Main Street, District 1",
      };

      await expect(
        validationUpdateUserSchema.validate(validData)
      ).resolves.toBeTruthy();
    });

    it("should reject fullName with less than 2 characters", async () => {
      const invalidData = {
        fullName: "A",
        dateOfBirth: "2000-01-01",
      };

      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow();
    });

    it("should reject fullName with more than 100 characters", async () => {
      const invalidData = {
        fullName: "A".repeat(101),
        dateOfBirth: "2000-01-01",
      };

      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow();
    });

    it("should reject empty fullName", async () => {
      const invalidData = {
        fullName: "",
        dateOfBirth: "2000-01-01",
      };

      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow();
    });

    it("should reject missing required fields", async () => {
      const minimalData = {
        fullName: "Nguyen Van A",
      };

      await expect(
        validationUpdateUserSchema.validate(minimalData)
      ).rejects.toThrow();
    });

    it("should validate email format if provided", async () => {
      const invalidEmailData = {
        fullName: "Nguyen Van A",
        email: "invalid-email",
      };

      await expect(
        validationUpdateUserSchema.validate(invalidEmailData)
      ).rejects.toThrow();
    });

    it("should accept valid date of birth format", async () => {
      const validData = {
        fullName: "Nguyen Van A",
        dateOfBirth: "15/05/1990",
        gender: "male",
        email: "test@example.com",
        phone: "0987654321",
        address: "123 Main Street",
      };

      await expect(
        validationUpdateUserSchema.validate(validData)
      ).resolves.toBeTruthy();
    });

    it("should accept valid phone number with all required fields", async () => {
      const validData = {
        fullName: "Nguyen Van A",
        phone: "0987654321",
        email: "test@example.com",
        gender: "female",
        address: "456 Second Street",
        dateOfBirth: "01/01/1995",
      };

      await expect(
        validationUpdateUserSchema.validate(validData)
      ).resolves.toBeTruthy();
    });
  });
});
