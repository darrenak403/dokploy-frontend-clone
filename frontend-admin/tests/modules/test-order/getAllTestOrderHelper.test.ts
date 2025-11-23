/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestOrder } from "@/types/test-order";

import {
  computeBoundary,
  filterTestOrders,
  formatDate,
  formatTestId,
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

  describe("computeBoundary", () => {
    it("should return null for 'all' filter", () => {
      expect(computeBoundary("all")).toBeNull();
    });

    it("should return null for empty filter", () => {
      expect(computeBoundary("")).toBeNull();
    });

    it("should return date 30 days ago for '30days' filter", () => {
      const result = computeBoundary("30days") as Date;
      expect(result).toBeInstanceOf(Date);
      const today = new Date();
      const expected = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      expected.setDate(expected.getDate() - 30);
      expect(result.getTime()).toBe(expected.getTime());
    });

    it("should return date 6 months ago for '6months' filter", () => {
      const result = computeBoundary("6months");
      expect(result).toBeInstanceOf(Date);
    });

    it("should return year number for '1year' filter", () => {
      const result = computeBoundary("1year");
      const expected = new Date().getFullYear() - 1;
      expect(result).toBe(expected);
    });

    it("should return null for unknown filter", () => {
      expect(computeBoundary("unknown")).toBeNull();
    });
  });

  describe("formatTestId", () => {
    it("should format number id as string", () => {
      expect(formatTestId(123)).toBe("123");
    });

    it("should format string id as is", () => {
      expect(formatTestId("ABC123")).toBe("ABC123");
    });

    it('should return "-" for undefined', () => {
      expect(formatTestId(undefined)).toBe("-");
    });

    it('should return "-" for null', () => {
      expect(formatTestId(null as any)).toBe("-");
    });

    it("should handle zero", () => {
      expect(formatTestId(0)).toBe("0");
    });
  });

  describe("filterTestOrders", () => {
    const mockTestOrders: TestOrder[] = [
      {
        id: 1,
        accessionNumber: "ACC001",
        patientId: 101,
        patientName: "Nguyen Van A",
        email: "a@example.com",
        phone: "0123456789",
        address: "Ha Noi",
        status: "PENDING",
        priority: { key: "high", label: "High" },
        createdBy: "admin@example.com",
        runBy: "doctor@example.com",
        runAt: "2024-01-02",
        yob: "1990-01-01",
        gender: "male",
      },
      {
        id: 2,
        accessionNumber: "ACC002",
        patientId: 102,
        patientName: "Tran Thi B",
        email: "b@example.com",
        phone: "0987654321",
        address: "Ho Chi Minh",
        status: "COMPLETED",
        priority: { key: "low", label: "Low" },
        createdBy: "admin@example.com",
        runBy: "nurse@example.com",
        runAt: "2024-01-04",
        yob: "1985-05-15",
        gender: "female",
      },
      {
        id: 3,
        accessionNumber: "ACC003",
        patientId: 103,
        patientName: "Le Van C",
        email: "c@example.com",
        phone: "0111222333",
        address: "Da Nang",
        status: "IN_PROGRESS",
        priority: { key: "medium", label: "Medium" },
        createdBy: "user@example.com",
        runBy: "doctor@example.com",
        runAt: "2024-01-06",
        yob: "1995-10-20",
        gender: "male",
      },
    ];

    it("should return all test orders when filter is 'all'", () => {
      const result = filterTestOrders(mockTestOrders, "", "all");
      expect(result.length).toBe(3);
    });

    it("should filter by status", () => {
      const result = filterTestOrders(mockTestOrders, "", "COMPLETED");
      expect(result.length).toBe(1);
      expect(result[0].status).toBe("COMPLETED");
    });

    it.skip("should filter by priority", () => {
      const result = filterTestOrders(mockTestOrders, "", "all", {
        key: "high",
        label: "High",
      } as any);
      expect(result.length).toBe(1);
      expect(result[0].priority).toEqual({ key: "high", label: "High" });
    });

    it("should search by patient ID", () => {
      const result = filterTestOrders(mockTestOrders, "101", "all");
      expect(result.length).toBe(1);
      expect(result[0].patientId).toBe(101);
    });

    it("should search by patient name", () => {
      const result = filterTestOrders(mockTestOrders, "nguyen", "all");
      expect(result.length).toBe(1);
      expect(result[0].patientName).toContain("Nguyen");
    });

    it("should search by email", () => {
      const result = filterTestOrders(mockTestOrders, "b@example", "all");
      expect(result.length).toBe(1);
      expect(result[0].email).toContain("b@example");
    });

    it("should search by phone", () => {
      const result = filterTestOrders(mockTestOrders, "0123456789", "all");
      expect(result.length).toBe(1);
      expect(result[0].phone).toBe("0123456789");
    });

    it("should search by address", () => {
      const result = filterTestOrders(mockTestOrders, "ha noi", "all");
      expect(result.length).toBe(1);
      expect(result[0].address).toContain("Ha Noi");
    });

    it("should search by createdBy", () => {
      const result = filterTestOrders(mockTestOrders, "user@example", "all");
      expect(result.length).toBe(1);
      expect(result[0].createdBy).toContain("user@example");
    });

    it("should search by runBy", () => {
      const result = filterTestOrders(mockTestOrders, "doctor@", "all");
      expect(result.length).toBe(2);
    });

    it("should search by status text", () => {
      const result = filterTestOrders(mockTestOrders, "pending", "all");
      expect(result.length).toBe(1);
      expect(result[0].status).toBe("PENDING");
    });

    it("should combine status filter and search", () => {
      const result = filterTestOrders(mockTestOrders, "admin", "PENDING");
      expect(result.length).toBe(1);
      expect(result[0].status).toBe("PENDING");
    });

    it.skip("should combine priority filter and search", () => {
      const result = filterTestOrders(mockTestOrders, "nguyen", "all", {
        key: "high",
        label: "High",
      } as any);
      expect(result.length).toBe(1);
    });

    it("should return empty array when no match", () => {
      const result = filterTestOrders(mockTestOrders, "nonexistent", "all");
      expect(result.length).toBe(0);
    });

    it("should handle empty query", () => {
      const result = filterTestOrders(mockTestOrders, "", "all");
      expect(result.length).toBe(3);
    });

    it("should handle whitespace query", () => {
      const result = filterTestOrders(mockTestOrders, "   ", "all");
      expect(result.length).toBe(3);
    });

    it("should be case insensitive", () => {
      const result = filterTestOrders(mockTestOrders, "NGUYEN", "all");
      expect(result.length).toBe(1);
    });
  });
});
