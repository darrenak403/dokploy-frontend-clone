/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  formatDate,
  genderKeyToLabel,
  getGenderLabel,
  getPriorityColor,
  getPriorityText,
  getStatusColor,
  getStatusText,
  parseDateOnly,
  priorityTokenToClass,
} from "@/modules/test-order/getAllTestOrderHelper";

describe("Test Order Helper Functions", () => {
  describe("getGenderLabel", () => {
    it("should return Vietnamese label for male", () => {
      expect(getGenderLabel("male")).toBe("Nam");
      expect(getGenderLabel("MALE")).toBe("Nam");
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

  describe("genderKeyToLabel", () => {
    it("should call getGenderLabel", () => {
      expect(genderKeyToLabel("male")).toBe("Nam");
    });
  });

  describe("getStatusColor", () => {
    it('should return "success" for COMPLETED status', () => {
      expect(getStatusColor("COMPLETED")).toBe("success");
      expect(getStatusColor("completed")).toBe("success");
    });

    it('should return "danger" for CANCELLED status', () => {
      expect(getStatusColor("CANCELLED")).toBe("danger");
      expect(getStatusColor("cancelled")).toBe("danger");
    });

    it('should return "warning" for PENDING status', () => {
      expect(getStatusColor("PENDING")).toBe("warning");
      expect(getStatusColor("pending")).toBe("warning");
    });

    it('should return "warning" for IN_PROGRESS status', () => {
      expect(getStatusColor("IN_PROGRESS")).toBe("warning");
      expect(getStatusColor("IN PROGRESS")).toBe("warning");
    });

    it('should return "success" for REVIEWED status', () => {
      expect(getStatusColor("REVIEWED")).toBe("success");
      expect(getStatusColor("AI REVIEWED")).toBe("success");
    });

    it('should return "default" for undefined', () => {
      expect(getStatusColor(undefined)).toBe("default");
    });

    it('should return "default" for unknown status', () => {
      expect(getStatusColor("UNKNOWN")).toBe("default");
    });
  });

  describe("getStatusText", () => {
    it("should return the status string", () => {
      expect(getStatusText("COMPLETED")).toBe("COMPLETED");
      expect(getStatusText("PENDING")).toBe("PENDING");
    });

    it('should return "Unknown" for undefined', () => {
      expect(getStatusText(undefined)).toBe("Unknown");
    });
  });

  describe("getPriorityColor", () => {
    it('should return "danger" for HIGH priority', () => {
      expect(getPriorityColor("HIGH")).toBe("danger");
      expect(getPriorityColor("high")).toBe("danger");
    });

    it('should return "warning" for MEDIUM priority', () => {
      expect(getPriorityColor("MEDIUM")).toBe("warning");
      expect(getPriorityColor("medium")).toBe("warning");
    });

    it('should return "success" for LOW priority', () => {
      expect(getPriorityColor("LOW")).toBe("success");
      expect(getPriorityColor("low")).toBe("success");
    });

    it('should return "default" for undefined', () => {
      expect(getPriorityColor(undefined)).toBe("default");
    });

    it('should return "default" for unknown priority', () => {
      expect(getPriorityColor("UNKNOWN")).toBe("default");
    });

    it("should handle PriorityOption object with key", () => {
      expect(getPriorityColor({ key: "high", label: "Cao" })).toBe("danger");
    });

    it("should handle PriorityOption object with label only", () => {
      expect(getPriorityColor({ label: "LOW" } as any)).toBe("success");
    });
  });

  describe("getPriorityText", () => {
    it("should return string priority as is", () => {
      expect(getPriorityText("HIGH")).toBe("HIGH");
    });

    it('should return "-" for undefined', () => {
      expect(getPriorityText(undefined)).toBe("-");
    });

    it("should return label from PriorityOption object", () => {
      expect(getPriorityText({ key: "high", label: "Cao" })).toBe("Cao");
    });

    it("should convert to string for unknown type", () => {
      expect(getPriorityText(123 as any)).toBe("123");
    });
  });

  describe("priorityTokenToClass", () => {
    it("should return green class for success token", () => {
      expect(priorityTokenToClass("success")).toBe("text-green-600");
    });

    it("should return yellow class for warning token", () => {
      expect(priorityTokenToClass("warning")).toBe("text-yellow-500");
    });

    it("should return red class for danger token", () => {
      expect(priorityTokenToClass("danger")).toBe("text-red-600");
    });

    it("should return gray class for default token", () => {
      expect(priorityTokenToClass("default")).toBe("text-gray-500");
      expect(priorityTokenToClass(undefined)).toBe("text-gray-500");
    });
  });

  describe("formatDate", () => {
    it("should format dd/mm/yyyy to locale string", () => {
      const result = formatDate("01/01/2024");
      expect(result).not.toBe("-");
      expect(result).toContain("2024");
    });

    it("should format dd/mm/yyyy HH:mm:ss to locale string", () => {
      const result = formatDate("01/01/2024 12:30:45");
      expect(result).not.toBe("-");
      expect(result).toContain("2024");
    });

    it("should format ISO date string", () => {
      const result = formatDate("2024-01-01");
      expect(result).not.toBe("-");
    });

    it('should return "-" for undefined or null', () => {
      expect(formatDate(undefined)).toBe("-");
      expect(formatDate(null)).toBe("-");
    });

    it('should return "-" for empty string', () => {
      expect(formatDate("")).toBe("-");
      expect(formatDate("   ")).toBe("-");
    });

    it('should return "-" for "null" string', () => {
      expect(formatDate("null")).toBe("-");
      expect(formatDate("NULL")).toBe("-");
    });

    it('should return "-" for invalid date', () => {
      expect(formatDate("invalid-date")).toBe("-");
    });
  });

  describe("parseDateOnly", () => {
    it("should parse dd/mm/yyyy format", () => {
      const result = parseDateOnly("01/01/2024");
      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(1);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getFullYear()).toBe(2024);
    });

    it("should parse dd-mm-yyyy format", () => {
      const result = parseDateOnly("01-01-2024");
      expect(result).toBeInstanceOf(Date);
    });

    it("should return null for undefined or null", () => {
      expect(parseDateOnly(undefined)).toBeNull();
      expect(parseDateOnly(null)).toBeNull();
    });

    it("should return null for empty string", () => {
      expect(parseDateOnly("")).toBeNull();
      expect(parseDateOnly("   ")).toBeNull();
    });

    it("should strip time from dd/mm/yyyy HH:mm:ss", () => {
      const result = parseDateOnly("01/01/2024 12:30:45");
      expect(result).toBeInstanceOf(Date);
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
      expect(result?.getSeconds()).toBe(0);
    });
  });
});
