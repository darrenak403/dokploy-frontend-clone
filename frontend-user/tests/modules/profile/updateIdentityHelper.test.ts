import {
  genderKeyToLabel,
  getGenderLabel,
  getNormalizedGenderLabel,
  mapInputToGenderKey,
  normalizeGender,
  validationIdentityNumberSchema,
} from "@/modules/profile/updateIdentityHelper";

describe("updateIdentityHelper", () => {
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
      expect(getGenderLabel("OTHER")).toBe("Khác");
    });

    it("should return empty string for undefined or empty input", () => {
      expect(getGenderLabel()).toBe("");
      expect(getGenderLabel("")).toBe("");
    });

    it("should return original value for unrecognized input", () => {
      expect(getGenderLabel("unknown")).toBe("unknown");
      expect(getGenderLabel("custom")).toBe("custom");
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
      expect(mapInputToGenderKey("khac")).toBe("other");
      expect(mapInputToGenderKey("other")).toBe("other");
    });

    it("should return empty string for undefined or empty input", () => {
      expect(mapInputToGenderKey()).toBe("");
      expect(mapInputToGenderKey("")).toBe("");
    });

    it("should handle whitespace correctly", () => {
      expect(mapInputToGenderKey(" Nam ")).toBe("male");
      expect(mapInputToGenderKey(" Nữ ")).toBe("female");
      expect(mapInputToGenderKey(" Khác ")).toBe("other");
    });

    it("should return lowercase for unrecognized input", () => {
      expect(mapInputToGenderKey("Custom")).toBe("custom");
      expect(mapInputToGenderKey("Unknown")).toBe("unknown");
    });
  });

  describe("genderKeyToLabel", () => {
    it("should convert gender key to display label", () => {
      expect(genderKeyToLabel("male")).toBe("Nam");
      expect(genderKeyToLabel("female")).toBe("Nữ");
      expect(genderKeyToLabel("other")).toBe("Khác");
    });

    it("should handle undefined input", () => {
      expect(genderKeyToLabel()).toBe("");
    });
  });

  describe("normalizeGender", () => {
    it('should normalize Vietnamese male variants to "male"', () => {
      expect(normalizeGender("Nam")).toBe("male");
      expect(normalizeGender("nam")).toBe("male");
      expect(normalizeGender("n")).toBe("male");
      expect(normalizeGender("male")).toBe("male");
    });

    it('should normalize Vietnamese female variants to "female"', () => {
      expect(normalizeGender("Nữ")).toBe("female");
      expect(normalizeGender("nữ")).toBe("female");
      expect(normalizeGender("nu")).toBe("female");
      expect(normalizeGender("female")).toBe("female");
    });

    it('should normalize "other" variants', () => {
      expect(normalizeGender("Khác")).toBe("other");
      expect(normalizeGender("khác")).toBe("other");
      expect(normalizeGender("khac")).toBe("other");
      expect(normalizeGender("other")).toBe("other");
    });

    it("should return empty string for empty input", () => {
      expect(normalizeGender()).toBe("");
      expect(normalizeGender("")).toBe("");
    });

    it("should return lowercase for unrecognized values", () => {
      expect(normalizeGender("Unknown")).toBe("unknown");
    });
  });

  describe("getNormalizedGenderLabel", () => {
    it("should return normalized gender", () => {
      expect(getNormalizedGenderLabel("Nam")).toBe("male");
      expect(getNormalizedGenderLabel("Nữ")).toBe("female");
      expect(getNormalizedGenderLabel("Khác")).toBe("other");
    });
  });

  describe("validationIdentityNumberSchema", () => {
    const validBaseData = {
      identifyNumber: "123456789",
      fullName: "Nguyễn Văn A",
      birthDate: "01/01/1990",
      gender: "male",
      recentLocation: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
      nationality: "Việt Nam",
      issueDate: "01/01/2020",
      validDate: "01/01/2030",
      issuePlace: "Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư",
      features: "Nốt ruồi trên má trái, cao 1m70",
    };

    it("should validate correct identity number", async () => {
      await expect(
        validationIdentityNumberSchema.validate(validBaseData)
      ).resolves.toBeDefined();
    });

    it("should reject identity number with less than 9 digits", async () => {
      const invalidData = {
        ...validBaseData,
        identifyNumber: "12345678",
      };

      await expect(
        validationIdentityNumberSchema.validate(invalidData)
      ).rejects.toThrow("Số căn cước phải có 9–12 chữ số");
    });

    it("should reject identity number with more than 12 digits", async () => {
      const invalidData = {
        ...validBaseData,
        identifyNumber: "1234567890123",
      };

      await expect(
        validationIdentityNumberSchema.validate(invalidData)
      ).rejects.toThrow("Số căn cước phải có 9–12 chữ số");
    });

    it("should reject identity number with non-numeric characters", async () => {
      const invalidData = {
        ...validBaseData,
        identifyNumber: "12345678a",
      };

      await expect(
        validationIdentityNumberSchema.validate(invalidData)
      ).rejects.toThrow();
    });

    it("should accept identity number with 9 digits", async () => {
      const validData = {
        ...validBaseData,
        identifyNumber: "123456789",
      };

      await expect(
        validationIdentityNumberSchema.validate(validData)
      ).resolves.toBeDefined();
    });

    it("should accept identity number with 12 digits", async () => {
      const validData = {
        ...validBaseData,
        identifyNumber: "123456789012",
      };

      await expect(
        validationIdentityNumberSchema.validate(validData)
      ).resolves.toBeDefined();
    });

    it("should reject empty identity number", async () => {
      const invalidData = {
        ...validBaseData,
        identifyNumber: "",
      };

      // Empty string triggers the regex error first before required check
      await expect(
        validationIdentityNumberSchema.validate(invalidData)
      ).rejects.toThrow();
    });

    it("should reject fullName with less than 10 characters", async () => {
      const invalidData = {
        ...validBaseData,
        fullName: "Short",
      };

      await expect(
        validationIdentityNumberSchema.validate(invalidData)
      ).rejects.toThrow("Họ và tên phải có ít nhất 10 ký tự");
    });

    it("should reject missing features field", async () => {
      const invalidData = {
        ...validBaseData,
        features: "short",
      };

      // Empty string triggers min length error
      await expect(
        validationIdentityNumberSchema.validate(invalidData)
      ).rejects.toThrow("Đặc điểm nhận dạng phải có ít nhất 10 ký tự");
    });

    it("should accept valid complete data", async () => {
      await expect(
        validationIdentityNumberSchema.validate(validBaseData)
      ).resolves.toBeDefined();
    });
  });
});
