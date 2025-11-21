import { Patient } from "@/types/patient";

import {
  computeBoundary,
  filterPatients,
  formatPatientId,
  genderKeyToLabel,
  genderStatusLabel,
  getGenderLabel,
  getStatusColor,
  getStatusLabel,
  getStatusText,
  mapInputToGenderKey,
} from "@/modules/patient/getAllPatientHelper";

describe("Patient Helper Functions", () => {
  describe("getGenderLabel", () => {
    it("should return Vietnamese label for male", () => {
      expect(getGenderLabel("male")).toBe("Nam");
      expect(getGenderLabel("Male")).toBe("Nam");
      expect(getGenderLabel("MALE")).toBe("Nam");
    });

    it("should return Vietnamese label for female", () => {
      expect(getGenderLabel("female")).toBe("Nữ");
      expect(getGenderLabel("Female")).toBe("Nữ");
    });

    it("should return Vietnamese label for other", () => {
      expect(getGenderLabel("other")).toBe("Khác");
      expect(getGenderLabel("Other")).toBe("Khác");
    });

    it("should return empty string for undefined or null", () => {
      expect(getGenderLabel(undefined)).toBe("");
      expect(getGenderLabel("")).toBe("");
    });

    it("should return original value for unknown gender", () => {
      expect(getGenderLabel("unknown")).toBe("unknown");
    });
  });

  describe("mapInputToGenderKey", () => {
    it('should map Vietnamese male inputs to "male"', () => {
      expect(mapInputToGenderKey("nam")).toBe("male");
      expect(mapInputToGenderKey("Nam")).toBe("male");
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
      expect(mapInputToGenderKey("other")).toBe("other");
    });

    it("should return empty string for empty input", () => {
      expect(mapInputToGenderKey(undefined)).toBe("");
      expect(mapInputToGenderKey("")).toBe("");
    });

    it("should return lowercase trimmed value for unknown input", () => {
      expect(mapInputToGenderKey(" unknown ")).toBe("unknown");
    });
  });

  describe("genderKeyToLabel", () => {
    it("should call getGenderLabel", () => {
      expect(genderKeyToLabel("male")).toBe("Nam");
      expect(genderKeyToLabel("female")).toBe("Nữ");
    });
  });

  describe("getStatusColor", () => {
    it('should return "danger" for deleted patients', () => {
      expect(getStatusColor(1)).toBe("danger");
      expect(getStatusColor(true)).toBe("danger");
    });

    it('should return "success" for active patients', () => {
      expect(getStatusColor(0)).toBe("success");
      expect(getStatusColor(false)).toBe("success");
      expect(getStatusColor(undefined)).toBe("success");
    });
  });

  describe("getStatusText", () => {
    it('should return "Inactive" for deleted patients', () => {
      expect(getStatusText(1)).toBe("Inactive");
      expect(getStatusText(true)).toBe("Inactive");
    });

    it('should return "Active" for active patients', () => {
      expect(getStatusText(0)).toBe("Active");
      expect(getStatusText(false)).toBe("Active");
      expect(getStatusText(undefined)).toBe("Active");
    });
  });

  describe("getStatusLabel", () => {
    it("should return Vietnamese label for active status", () => {
      expect(getStatusLabel("active")).toBe("Đang hoạt động");
      expect(getStatusLabel("Active")).toBe("Đang hoạt động");
    });

    it("should return Vietnamese label for inactive status", () => {
      expect(getStatusLabel("not active")).toBe("Ngừng hoạt động");
      expect(getStatusLabel("Not Active")).toBe("Ngừng hoạt động");
    });

    it("should return empty string for empty input", () => {
      expect(getStatusLabel(undefined)).toBe("");
      expect(getStatusLabel("")).toBe("");
    });

    it("should return original value for unknown status", () => {
      expect(getStatusLabel("unknown")).toBe("unknown");
    });
  });

  describe("genderStatusLabel", () => {
    it("should call getStatusLabel", () => {
      expect(genderStatusLabel("active")).toBe("Đang hoạt động");
    });
  });

  describe("formatPatientId", () => {
    it("should format number id to string", () => {
      expect(formatPatientId(123)).toBe("123");
    });

    it("should keep string id as is", () => {
      expect(formatPatientId("P123")).toBe("P123");
    });

    it('should return "-" for undefined', () => {
      expect(formatPatientId(undefined)).toBe("-");
    });
  });

  describe("computeBoundary", () => {
    it('should return null for "all" filter', () => {
      expect(computeBoundary("all")).toBeNull();
      expect(computeBoundary("")).toBeNull();
    });

    it('should return date 30 days ago for "30days" filter', () => {
      const result = computeBoundary("30days");
      expect(result).toBeInstanceOf(Date);
      if (result instanceof Date) {
        const today = new Date();
        const expected = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        expected.setDate(expected.getDate() - 30);
        expect(result.getTime()).toBe(expected.getTime());
      }
    });

    it('should return date 6 months ago for "6months" filter', () => {
      const result = computeBoundary("6months");
      expect(result).toBeInstanceOf(Date);
      if (result instanceof Date) {
        const today = new Date();
        const expected = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        expected.setMonth(expected.getMonth() - 6);
        expect(result.getTime()).toBe(expected.getTime());
      }
    });

    it('should return last year number for "1year" filter', () => {
      const result = computeBoundary("1year");
      const expected = new Date().getFullYear() - 1;
      expect(result).toBe(expected);
    });

    it("should return null for unknown filter", () => {
      expect(computeBoundary("unknown")).toBeNull();
    });
  });

  describe("filterPatients", () => {
    const mockPatients: Patient[] = [
      {
        id: 1,
        fullName: "Nguyen Van A",
        email: "a@test.com",
        phone: "0123456789",
        deleted: 0,
        identityNumber: null,
        createdBy: "user1",
        createdAt: "2024-01-01",
      },
      {
        id: 2,
        fullName: "Tran Thi B",
        email: "b@test.com",
        phone: "0987654321",
        deleted: 1,
        identityNumber: null,
        createdBy: "user2",
        createdAt: "2024-01-02",
      },
      {
        id: 3,
        fullName: "Le Van C",
        email: "c@test.com",
        phone: "0111222333",
        deleted: false,
        identityNumber: null,
        createdBy: "user3",
        createdAt: "2024-01-03",
      },
      {
        id: 4,
        fullName: "Pham Thi D",
        email: "d@test.com",
        phone: "0444555666",
        deleted: true,
        identityNumber: null,
        createdBy: "user4",
        createdAt: "2024-01-04",
      },
    ];

    it('should return all patients when no query and status is "all"', () => {
      const result = filterPatients(mockPatients, "", "all");
      expect(result).toHaveLength(4);
    });

    it("should filter by active status", () => {
      const result = filterPatients(mockPatients, "", "active");
      expect(result).toHaveLength(2);
      expect(result.every((p) => !p.deleted || p.deleted === 0)).toBe(true);
    });

    it("should filter by inactive status", () => {
      const result = filterPatients(mockPatients, "", "inactive");
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.deleted === 1 || p.deleted === true)).toBe(
        true
      );
    });

    it("should filter by patient id or other fields containing query", () => {
      const result = filterPatients(mockPatients, "1", "all");
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((p) => p.id === 1 || p.phone?.includes("1"))).toBe(
        true
      );
    });

    it("should filter by full name (case insensitive)", () => {
      const result = filterPatients(mockPatients, "nguyen", "all");
      expect(result).toHaveLength(1);
      expect(result[0].fullName).toBe("Nguyen Van A");
    });

    it("should filter by email", () => {
      const result = filterPatients(mockPatients, "b@test", "all");
      expect(result).toHaveLength(1);
      expect(result[0].email).toBe("b@test.com");
    });

    it("should filter by phone", () => {
      const result = filterPatients(mockPatients, "0123", "all");
      expect(result).toHaveLength(1);
      expect(result[0].phone).toBe("0123456789");
    });

    it("should combine status and query filters", () => {
      const result = filterPatients(mockPatients, "tran", "inactive");
      expect(result).toHaveLength(1);
      expect(result[0].fullName).toBe("Tran Thi B");
    });

    it("should handle empty query with trimming", () => {
      const result = filterPatients(mockPatients, "   ", "all");
      expect(result).toHaveLength(4);
    });
  });
});
