import {
  getStatusColor,
  getStatusDisplay,
  getStatusIcon,
  getStatusText,
} from "@/modules/regent/getAllRegentHelper";

describe("Reagent Helper Functions", () => {
  describe("getStatusText", () => {
    it("should return Vietnamese text for AVAILABLE status", () => {
      expect(getStatusText("AVAILABLE")).toBe("Có sẵn");
    });

    it("should return Vietnamese text for OUT_OF_STOCK status", () => {
      expect(getStatusText("OUT_OF_STOCK")).toBe("Hết hàng");
    });

    it("should return Vietnamese text for EXPIRED status", () => {
      expect(getStatusText("EXPIRED")).toBe("Hết hạn sử dụng");
    });

    it("should return original status for unknown status", () => {
      expect(getStatusText("UNKNOWN")).toBe("UNKNOWN");
      expect(getStatusText("PENDING")).toBe("PENDING");
    });
  });

  describe("getStatusColor", () => {
    it('should return "success" for AVAILABLE status', () => {
      expect(getStatusColor("AVAILABLE")).toBe("success");
    });

    it('should return "warning" for OUT_OF_STOCK status', () => {
      expect(getStatusColor("OUT_OF_STOCK")).toBe("warning");
    });

    it('should return "danger" for EXPIRED status', () => {
      expect(getStatusColor("EXPIRED")).toBe("danger");
    });

    it('should return "default" for unknown status', () => {
      expect(getStatusColor("UNKNOWN")).toBe("default");
      expect(getStatusColor("PENDING")).toBe("default");
    });
  });

  describe("getStatusIcon", () => {
    it("should return check-circle icon for AVAILABLE status", () => {
      expect(getStatusIcon("AVAILABLE")).toBe("mdi:check-circle");
    });

    it("should return package-variant-closed icon for OUT_OF_STOCK status", () => {
      expect(getStatusIcon("OUT_OF_STOCK")).toBe("mdi:package-variant-closed");
    });

    it("should return timer-alert icon for EXPIRED status", () => {
      expect(getStatusIcon("EXPIRED")).toBe("mdi:timer-alert");
    });

    it("should return help-circle icon for unknown status", () => {
      expect(getStatusIcon("UNKNOWN")).toBe("mdi:help-circle");
      expect(getStatusIcon("PENDING")).toBe("mdi:help-circle");
    });
  });

  describe("getStatusDisplay", () => {
    it("should return complete display info for AVAILABLE status", () => {
      const result = getStatusDisplay("AVAILABLE");
      expect(result).toEqual({
        text: "Có sẵn",
        color: "text-green-700 dark:text-green-300",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-500",
      });
    });

    it("should return complete display info for OUT_OF_STOCK status", () => {
      const result = getStatusDisplay("OUT_OF_STOCK");
      expect(result).toEqual({
        text: "Hết hàng",
        color: "text-yellow-700 dark:text-yellow-300",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        borderColor: "border-yellow-500",
      });
    });

    it("should return complete display info for EXPIRED status", () => {
      const result = getStatusDisplay("EXPIRED");
      expect(result).toEqual({
        text: "Hết hạn sử dụng",
        color: "text-red-700 dark:text-red-300",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        borderColor: "border-red-500",
      });
    });

    it("should return OUT_OF_STOCK display for unknown status (fallback)", () => {
      const result = getStatusDisplay("UNKNOWN");
      const expected = getStatusDisplay("OUT_OF_STOCK");
      expect(result).toEqual(expected);
    });
  });
});
