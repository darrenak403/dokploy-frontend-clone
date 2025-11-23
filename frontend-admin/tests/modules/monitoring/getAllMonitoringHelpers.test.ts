import { Monitoring } from "@/types/monitoring";

import {
  filterByStatus,
  filterByTimeRange,
  formatTimestamp,
  getMonitoringStats,
  getStatusColorClass,
  getStatusText,
  searchMonitoring,
} from "@/modules/monitoring/getAllMonitoringHelpers";

const mockMonitoringData: Monitoring[] = [
  {
    service: "User Service",
    action: "CREATE",
    entity: "User",
    entityId: "123",
    performedBy: "admin@example.com",
    status: "SUCCESS",
    message: "User created successfully",
    traceId: "trace-1",
    timestamp: "2025-11-22T10:00:00Z",
  },
  {
    service: "Order Service",
    action: "UPDATE",
    entity: "Order",
    entityId: "456",
    performedBy: "user@example.com",
    status: "FAILURE",
    message: "Order update failed",
    traceId: "trace-2",
    timestamp: "2025-11-22T09:30:00Z",
  },
  {
    service: "Payment Service",
    action: "DELETE",
    entity: "Payment",
    entityId: "789",
    performedBy: "admin@example.com",
    status: "ERROR",
    message: "Payment deletion error",
    traceId: "trace-3",
    timestamp: "2025-11-22T08:00:00Z",
  },
];

describe("getAllMonitoringHelpers", () => {
  describe("getStatusText", () => {
    it("should return Vietnamese text for SUCCESS", () => {
      expect(getStatusText("SUCCESS")).toBe("Thành công");
    });

    it("should return Vietnamese text for FAILURE", () => {
      expect(getStatusText("FAILURE")).toBe("Thất bại");
    });

    it("should return Vietnamese text for ERROR", () => {
      expect(getStatusText("ERROR")).toBe("Lỗi");
    });

    it("should return original status for unknown status", () => {
      expect(getStatusText("UNKNOWN")).toBe("UNKNOWN");
    });
  });

  describe("getStatusColorClass", () => {
    it("should return green classes for SUCCESS", () => {
      const classes = getStatusColorClass("SUCCESS");
      expect(classes).toContain("bg-green-100");
      expect(classes).toContain("text-green-800");
    });

    it("should return red classes for FAILURE", () => {
      const classes = getStatusColorClass("FAILURE");
      expect(classes).toContain("bg-red-100");
      expect(classes).toContain("text-red-800");
    });

    it("should return orange classes for ERROR", () => {
      const classes = getStatusColorClass("ERROR");
      expect(classes).toContain("bg-orange-100");
      expect(classes).toContain("text-orange-800");
    });

    it("should return default gray classes for unknown status", () => {
      const classes = getStatusColorClass("UNKNOWN");
      expect(classes).toContain("bg-gray-100");
      expect(classes).toContain("text-gray-800");
    });
  });

  describe("formatTimestamp", () => {
    it("should format timestamp to Vietnamese locale", () => {
      const formatted = formatTimestamp("2025-11-22T10:00:00Z");
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it("should include time in formatted output", () => {
      const formatted = formatTimestamp("2025-11-22T10:30:45Z");
      expect(formatted).toMatch(/\d{2}:\d{2}:\d{2}/);
    });
  });

  describe("filterByTimeRange", () => {
    it("should return all data when timeRange is 'all'", () => {
      const result = filterByTimeRange(mockMonitoringData, "all");
      expect(result).toEqual(mockMonitoringData);
    });

    it("should return all data when timeRange is empty", () => {
      const result = filterByTimeRange(mockMonitoringData, "");
      expect(result).toEqual(mockMonitoringData);
    });

    it("should filter data within 1 hour range", () => {
      const now = new Date();
      const recentData: Monitoring[] = [
        {
          ...mockMonitoringData[0],
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        },
      ];

      const result = filterByTimeRange(recentData, "1h");
      expect(result.length).toBe(1);
    });

    it("should filter data within 24 hour range", () => {
      const now = new Date();
      const recentData: Monitoring[] = [
        {
          ...mockMonitoringData[0],
          timestamp: new Date(
            now.getTime() - 12 * 60 * 60 * 1000
          ).toISOString(),
        },
      ];

      const result = filterByTimeRange(recentData, "24h");
      expect(result.length).toBe(1);
    });

    it("should return empty array for data outside time range", () => {
      const oldData: Monitoring[] = [
        {
          ...mockMonitoringData[0],
          timestamp: "2020-01-01T00:00:00Z",
        },
      ];

      const result = filterByTimeRange(oldData, "1h");
      expect(result.length).toBe(0);
    });
  });

  describe("filterByStatus", () => {
    it("should return all data when status is 'all'", () => {
      const result = filterByStatus(mockMonitoringData, "all");
      expect(result).toEqual(mockMonitoringData);
    });

    it("should return all data when status is empty", () => {
      const result = filterByStatus(mockMonitoringData, "");
      expect(result).toEqual(mockMonitoringData);
    });

    it("should filter data by SUCCESS status", () => {
      const result = filterByStatus(mockMonitoringData, "SUCCESS");
      expect(result.length).toBe(1);
      expect(result[0].status).toBe("SUCCESS");
    });

    it("should filter data by FAILURE status", () => {
      const result = filterByStatus(mockMonitoringData, "FAILURE");
      expect(result.length).toBe(1);
      expect(result[0].status).toBe("FAILURE");
    });

    it("should filter data by ERROR status", () => {
      const result = filterByStatus(mockMonitoringData, "ERROR");
      expect(result.length).toBe(1);
      expect(result[0].status).toBe("ERROR");
    });
  });

  describe("searchMonitoring", () => {
    it("should return all data when search text is empty", () => {
      const result = searchMonitoring(mockMonitoringData, "");
      expect(result).toEqual(mockMonitoringData);
    });

    it("should search by entity name", () => {
      const result = searchMonitoring(mockMonitoringData, "Order");
      expect(result.length).toBe(1);
      expect(result[0].entity).toBe("Order");
    });

    it("should search by service name", () => {
      const result = searchMonitoring(mockMonitoringData, "Order Service");
      expect(result.length).toBe(1);
      expect(result[0].service).toBe("Order Service");
    });

    it("should search by performer email", () => {
      const result = searchMonitoring(mockMonitoringData, "admin@example.com");
      expect(result.length).toBe(2);
    });

    it("should search by action", () => {
      const result = searchMonitoring(mockMonitoringData, "CREATE");
      expect(result.length).toBe(1);
      expect(result[0].action).toBe("CREATE");
    });

    it("should be case insensitive", () => {
      const result = searchMonitoring(mockMonitoringData, "user");
      expect(result.length).toBeGreaterThan(0);
    });

    it("should return empty array when no match found", () => {
      const result = searchMonitoring(mockMonitoringData, "NonExistent");
      expect(result.length).toBe(0);
    });
  });

  describe("getMonitoringStats", () => {
    it("should calculate total count correctly", () => {
      const stats = getMonitoringStats(mockMonitoringData);
      expect(stats.total).toBe(3);
    });

    it("should calculate success count correctly", () => {
      const stats = getMonitoringStats(mockMonitoringData);
      expect(stats.successCount).toBe(1);
    });

    it("should calculate failure count correctly", () => {
      const stats = getMonitoringStats(mockMonitoringData);
      expect(stats.failureCount).toBe(1);
    });

    it("should calculate error count correctly", () => {
      const stats = getMonitoringStats(mockMonitoringData);
      expect(stats.errorCount).toBe(1);
    });

    it("should calculate success rate correctly", () => {
      const stats = getMonitoringStats(mockMonitoringData);
      expect(stats.successRate).toBe("33.3");
    });

    it("should return 0 success rate for empty data", () => {
      const stats = getMonitoringStats([]);
      expect(stats.successRate).toBe("0");
    });

    it("should count unique services correctly", () => {
      const stats = getMonitoringStats(mockMonitoringData);
      expect(stats.uniqueServices).toBe(3);
    });

    it("should count unique performers correctly", () => {
      const stats = getMonitoringStats(mockMonitoringData);
      expect(stats.uniquePerformers).toBe(2);
    });

    it("should count recent activities correctly", () => {
      const now = new Date();
      const recentData: Monitoring[] = [
        {
          ...mockMonitoringData[0],
          timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        },
        {
          ...mockMonitoringData[1],
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        },
      ];

      const stats = getMonitoringStats(recentData);
      expect(stats.recentActivities).toBe(1);
    });

    it("should handle empty array correctly", () => {
      const stats = getMonitoringStats([]);
      expect(stats.total).toBe(0);
      expect(stats.successCount).toBe(0);
      expect(stats.failureCount).toBe(0);
      expect(stats.errorCount).toBe(0);
      expect(stats.uniqueServices).toBe(0);
      expect(stats.uniquePerformers).toBe(0);
      expect(stats.recentActivities).toBe(0);
    });
  });
});
