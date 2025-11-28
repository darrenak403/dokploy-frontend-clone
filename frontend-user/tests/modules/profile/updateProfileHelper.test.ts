import {
  genderKeyToLabel,
  getGenderLabel,
  mapInputToGenderKey,
  validationUpdateUserSchema,
} from "@/modules/profile/updateProfileHelper";

describe("updateProfileHelper", () => {
  describe("getGenderLabel", () => {
    it('should return "Nam" for male', () => {
      expect(getGenderLabel("male")).toBe("Nam");
      expect(getGenderLabel("Male")).toBe("Nam");
      expect(getGenderLabel("MALE")).toBe("Nam");
    });

    it('should return "Nữ" for female', () => {
      expect(getGenderLabel("female")).toBe("Nữ");
      expect(getGenderLabel("Female")).toBe("Nữ");
      expect(getGenderLabel("FEMALE")).toBe("Nữ");
    });

    it('should return "Khác" for other', () => {
      expect(getGenderLabel("other")).toBe("Khác");
      expect(getGenderLabel("Other")).toBe("Khác");
    });

    it("should return empty string for undefined", () => {
      expect(getGenderLabel()).toBe("");
      expect(getGenderLabel("")).toBe("");
    });

    it("should return original value for unrecognized input", () => {
      expect(getGenderLabel("unknown")).toBe("unknown");
    });
  });

  describe("mapInputToGenderKey", () => {
    it('should map Vietnamese "Nam" to "male"', () => {
      expect(mapInputToGenderKey("Nam")).toBe("male");
      expect(mapInputToGenderKey("nam")).toBe("male");
      expect(mapInputToGenderKey("n")).toBe("male");
      expect(mapInputToGenderKey("male")).toBe("male");
    });

    it('should map Vietnamese "Nữ" to "female"', () => {
      expect(mapInputToGenderKey("Nữ")).toBe("female");
      expect(mapInputToGenderKey("nữ")).toBe("female");
      expect(mapInputToGenderKey("nu")).toBe("female");
      expect(mapInputToGenderKey("female")).toBe("female");
    });

    it('should map "Khác" to "other"', () => {
      expect(mapInputToGenderKey("Khác")).toBe("other");
      expect(mapInputToGenderKey("khác")).toBe("other");
      expect(mapInputToGenderKey("other")).toBe("other");
    });

    it('should map "other" input to "other"', () => {
      expect(mapInputToGenderKey("other")).toBe("other");
    });

    it("should return empty string for undefined", () => {
      expect(mapInputToGenderKey()).toBe("");
      expect(mapInputToGenderKey("")).toBe("");
    });

    it("should handle whitespace", () => {
      expect(mapInputToGenderKey(" Nam ")).toBe("male");
      expect(mapInputToGenderKey(" Nữ ")).toBe("female");
    });
  });

  describe("genderKeyToLabel", () => {
    it("should convert gender key to label", () => {
      expect(genderKeyToLabel("male")).toBe("Nam");
      expect(genderKeyToLabel("female")).toBe("Nữ");
      expect(genderKeyToLabel("other")).toBe("Khác");
    });
  });

  describe("validationUpdateUserSchema", () => {
    const validData = {
      fullName: "Nguyễn Văn A",
      dateOfBirth: "15/06/1990",
      gender: "male",
      phone: "0987654321",
      address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
      email: "nguyenvana@example.com",
    };

    it("should validate correct data", async () => {
      await expect(
        validationUpdateUserSchema.validate(validData)
      ).resolves.toBeDefined();
    });

    it("should reject fullName with less than 2 characters", async () => {
      const invalidData = { ...validData, fullName: "A" };
      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow("Họ và tên phải có ít nhất 2 ký tự");
    });

    it("should reject fullName with more than 100 characters", async () => {
      const invalidData = { ...validData, fullName: "A".repeat(101) };
      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow("Họ và tên không được vượt quá 100 ký tự");
    });

    it("should reject invalid date format", async () => {
      const invalidData = { ...validData, dateOfBirth: "1990-06-15" };
      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ (dd/mm/yyyy)");
    });

    it("should reject invalid date values", async () => {
      const invalidData = { ...validData, dateOfBirth: "32/13/2020" };
      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should reject date with day out of range", async () => {
      const invalidData = { ...validData, dateOfBirth: "00/06/1990" };
      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow();
    });

    it("should reject date with month out of range", async () => {
      const invalidData = { ...validData, dateOfBirth: "15/13/1990" };
      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow();
    });

    it("should reject future dates for age validation", async () => {
      const futureYear = new Date().getFullYear() + 1;
      const invalidData = { ...validData, dateOfBirth: `15/06/${futureYear}` };
      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow();
    });

    it("should accept valid date at boundaries", async () => {
      const validEdgeCase = {
        ...validData,
        dateOfBirth: "01/01/1900",
        address: "123 Main Street, District 1",
      };
      await expect(
        validationUpdateUserSchema.validate(validEdgeCase)
      ).resolves.toBeDefined();
    });

    it("should validate leap year dates correctly", async () => {
      const leapYearData = {
        ...validData,
        dateOfBirth: "29/02/2020",
        address: "456 Sample Road, Area 2",
      };
      await expect(
        validationUpdateUserSchema.validate(leapYearData)
      ).resolves.toBeDefined();
    });

    it("should reject invalid leap year dates", async () => {
      const invalidLeapYear = {
        ...validData,
        dateOfBirth: "29/02/2021",
        address: "789 Test Avenue, Zone 3",
      };
      await expect(
        validationUpdateUserSchema.validate(invalidLeapYear)
      ).rejects.toThrow();
    });

    it("should require all mandatory fields", async () => {
      const incompleteData = { fullName: "Test User" };
      await expect(
        validationUpdateUserSchema.validate(incompleteData)
      ).rejects.toThrow();
    });

    it("should reject address with less than 10 characters", async () => {
      const invalidData = { ...validData, address: "Short" };
      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow("Địa chỉ phải có ít nhất 10 ký tự");
    });

    it("should reject invalid email format", async () => {
      const invalidData = { ...validData, email: "invalid-email" };
      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow("Vui lòng nhập địa chỉ email hợp lệ");
    });

    it("should reject invalid phone number format", async () => {
      const invalidData = { ...validData, phone: "123" };
      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow("Số điện thoại phải có 10-11 chữ số");
    });

    it("should reject invalid repeated phone numbers", async () => {
      const invalidData = { ...validData, phone: "0000000000" };
      await expect(
        validationUpdateUserSchema.validate(invalidData)
      ).rejects.toThrow();
    });
  });
});
