import {
  getStatusColor,
  getStatusDisplay,
  getStatusIcon,
  getStatusText,
} from "@/modules/wareHouse/createUpdateWareHouseIntrustmentHelper";

describe("Warehouse Helper Functions", () => {
  describe("getStatusText", () => {
    it("should return Vietnamese text for READY status", () => {
      expect(getStatusText("READY")).toBe("Sẵn sàng");
    });

    it("should return Vietnamese text for PROCESSING status", () => {
      expect(getStatusText("PROCESSING")).toBe("Đang xử lý");
    });

    it("should return Vietnamese text for MAINTENANCE status", () => {
      expect(getStatusText("MAINTENANCE")).toBe("Bảo trì");
    });

    it("should return Vietnamese text for ERROR status", () => {
      expect(getStatusText("ERROR")).toBe("Lỗi");
    });

    it("should return Vietnamese text for INACTIVE status", () => {
      expect(getStatusText("INACTIVE")).toBe("Không hoạt động");
    });

    it("should return original status for unknown values", () => {
      expect(getStatusText("UNKNOWN")).toBe("UNKNOWN");
      expect(getStatusText("")).toBe("");
      expect(getStatusText("custom_status")).toBe("custom_status");
    });

    it("should be case sensitive", () => {
      expect(getStatusText("ready")).toBe("ready"); // lowercase not matched
      expect(getStatusText("Ready")).toBe("Ready");
    });
  });

  describe("getStatusColor", () => {
    it('should return "success" for READY status', () => {
      expect(getStatusColor("READY")).toBe("success");
    });

    it('should return "primary" for PROCESSING status', () => {
      expect(getStatusColor("PROCESSING")).toBe("primary");
    });

    it('should return "warning" for MAINTENANCE status', () => {
      expect(getStatusColor("MAINTENANCE")).toBe("warning");
    });

    it('should return "danger" for ERROR status', () => {
      expect(getStatusColor("ERROR")).toBe("danger");
    });

    it('should return "default" for INACTIVE status', () => {
      expect(getStatusColor("INACTIVE")).toBe("default");
    });

    it('should return "default" for unknown status', () => {
      expect(getStatusColor("UNKNOWN")).toBe("default");
      expect(getStatusColor("")).toBe("default");
    });

    it("should be case sensitive", () => {
      expect(getStatusColor("ready")).toBe("default");
    });
  });

  describe("getStatusIcon", () => {
    it("should return check-circle icon for READY status", () => {
      expect(getStatusIcon("READY")).toBe("mdi:check-circle");
    });

    it("should return cog icon for PROCESSING status", () => {
      expect(getStatusIcon("PROCESSING")).toBe("mdi:cog");
    });

    it("should return wrench icon for MAINTENANCE status", () => {
      expect(getStatusIcon("MAINTENANCE")).toBe("mdi:wrench");
    });

    it("should return alert-circle icon for ERROR status", () => {
      expect(getStatusIcon("ERROR")).toBe("mdi:alert-circle");
    });

    it("should return power-off icon for INACTIVE status", () => {
      expect(getStatusIcon("INACTIVE")).toBe("mdi:power-off");
    });

    it("should return help-circle icon for unknown status", () => {
      expect(getStatusIcon("UNKNOWN")).toBe("mdi:help-circle");
      expect(getStatusIcon("")).toBe("mdi:help-circle");
    });

    it("should be case sensitive", () => {
      expect(getStatusIcon("ready")).toBe("mdi:help-circle");
    });
  });

  describe("getStatusDisplay", () => {
    it("should return full display info for READY status", () => {
      const result = getStatusDisplay("READY");
      expect(result.text).toBe("Sẵn sàng");
      expect(result.color).toBe("text-green-700 dark:text-green-300");
      expect(result.bgColor).toBe("bg-green-50 dark:bg-green-900/20");
      expect(result.borderColor).toBe("border-green-500");
    });

    it("should return full display info for PROCESSING status", () => {
      const result = getStatusDisplay("PROCESSING");
      expect(result.text).toBe("Đang xử lý");
      expect(result.color).toBe("text-purple-700 dark:text-purple-300");
      expect(result.bgColor).toBe("bg-purple-50 dark:bg-purple-900/20");
      expect(result.borderColor).toBe("border-purple-500");
    });

    it("should return full display info for MAINTENANCE status", () => {
      const result = getStatusDisplay("MAINTENANCE");
      expect(result.text).toBe("Bảo trì");
      expect(result.color).toBe("text-yellow-700 dark:text-yellow-300");
      expect(result.bgColor).toBe("bg-yellow-50 dark:bg-yellow-900/20");
      expect(result.borderColor).toBe("border-yellow-500");
    });

    it("should return full display info for ERROR status", () => {
      const result = getStatusDisplay("ERROR");
      expect(result.text).toBe("Lỗi");
      expect(result.color).toBe("text-red-700 dark:text-red-300");
      expect(result.bgColor).toBe("bg-red-50 dark:bg-red-900/20");
      expect(result.borderColor).toBe("border-red-500");
    });

    it("should return full display info for INACTIVE status", () => {
      const result = getStatusDisplay("INACTIVE");
      expect(result.text).toBe("Không hoạt động");
      expect(result.color).toBe("text-gray-700 dark:text-gray-300");
      expect(result.bgColor).toBe("bg-gray-50 dark:bg-gray-900/20");
      expect(result.borderColor).toBe("border-gray-500");
    });

    it("should return INACTIVE display for unknown status", () => {
      const result = getStatusDisplay("UNKNOWN");
      expect(result.text).toBe("Không hoạt động");
      expect(result.color).toBe("text-gray-700 dark:text-gray-300");
    });

    it("should return object with all required properties", () => {
      const result = getStatusDisplay("READY");
      expect(result).toHaveProperty("text");
      expect(result).toHaveProperty("color");
      expect(result).toHaveProperty("bgColor");
      expect(result).toHaveProperty("borderColor");
    });
  });

  describe("Integration: All functions with same status", () => {
    it("should handle READY status consistently across all functions", () => {
      expect(getStatusText("READY")).toBe("Sẵn sàng");
      expect(getStatusColor("READY")).toBe("success");
      expect(getStatusIcon("READY")).toBe("mdi:check-circle");
      expect(getStatusDisplay("READY").text).toBe("Sẵn sàng");
    });

    it("should handle ERROR status consistently across all functions", () => {
      expect(getStatusText("ERROR")).toBe("Lỗi");
      expect(getStatusColor("ERROR")).toBe("danger");
      expect(getStatusIcon("ERROR")).toBe("mdi:alert-circle");
      expect(getStatusDisplay("ERROR").text).toBe("Lỗi");
    });

    it("should handle unknown status consistently across all functions", () => {
      const unknownStatus = "CUSTOM_STATUS";
      expect(getStatusText(unknownStatus)).toBe(unknownStatus);
      expect(getStatusColor(unknownStatus)).toBe("default");
      expect(getStatusIcon(unknownStatus)).toBe("mdi:help-circle");
      expect(getStatusDisplay(unknownStatus).text).toBe("Không hoạt động");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string", () => {
      expect(getStatusText("")).toBe("");
      expect(getStatusColor("")).toBe("default");
      expect(getStatusIcon("")).toBe("mdi:help-circle");
      expect(getStatusDisplay("").text).toBe("Không hoạt động");
    });

    it("should handle special characters", () => {
      expect(getStatusText("!@#$")).toBe("!@#$");
      expect(getStatusColor("!@#$")).toBe("default");
    });

    it("should handle numeric strings", () => {
      expect(getStatusText("12345")).toBe("12345");
      expect(getStatusColor("12345")).toBe("default");
    });
  });
});
