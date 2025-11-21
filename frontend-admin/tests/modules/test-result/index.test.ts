import { getFlagColor, getFlagIcon, getFlagLabel } from "@/modules/test-result";

describe("Test Result Utility Functions", () => {
  describe("getFlagColor", () => {
    it('should return "danger" for H flag', () => {
      expect(getFlagColor("H")).toBe("danger");
    });

    it('should return "warning" for L flag', () => {
      expect(getFlagColor("L")).toBe("warning");
    });

    it('should return "success" for N flag', () => {
      expect(getFlagColor("N")).toBe("success");
    });

    it('should return "default" for unknown flag', () => {
      expect(getFlagColor("X")).toBe("default");
      expect(getFlagColor("")).toBe("default");
      expect(getFlagColor("unknown")).toBe("default");
    });

    it("should handle lowercase flags", () => {
      expect(getFlagColor("h")).toBe("default"); // case sensitive
      expect(getFlagColor("l")).toBe("default");
      expect(getFlagColor("n")).toBe("default");
    });
  });

  describe("getFlagLabel", () => {
    it('should return "High" for H flag', () => {
      expect(getFlagLabel("H")).toBe("High");
    });

    it('should return "Low" for L flag', () => {
      expect(getFlagLabel("L")).toBe("Low");
    });

    it('should return "Normal" for N flag', () => {
      expect(getFlagLabel("N")).toBe("Normal");
    });

    it("should return the original flag for unknown values", () => {
      expect(getFlagLabel("X")).toBe("X");
      expect(getFlagLabel("unknown")).toBe("unknown");
      expect(getFlagLabel("")).toBe("");
    });

    it("should handle special characters", () => {
      expect(getFlagLabel("!@#")).toBe("!@#");
    });
  });

  describe("getFlagIcon", () => {
    it("should return trending-up icon for H flag", () => {
      expect(getFlagIcon("H")).toBe("mdi:trending-up");
    });

    it("should return trending-down icon for L flag", () => {
      expect(getFlagIcon("L")).toBe("mdi:trending-down");
    });

    it("should return minus icon for N flag", () => {
      expect(getFlagIcon("N")).toBe("mdi:minus");
    });

    it("should return null for unknown flag", () => {
      expect(getFlagIcon("X")).toBeNull();
      expect(getFlagIcon("")).toBeNull();
      expect(getFlagIcon("unknown")).toBeNull();
    });

    it("should handle lowercase flags", () => {
      expect(getFlagIcon("h")).toBeNull(); // case sensitive
      expect(getFlagIcon("l")).toBeNull();
      expect(getFlagIcon("n")).toBeNull();
    });
  });

  describe("Integration: All functions with same input", () => {
    it("should handle H flag consistently", () => {
      expect(getFlagColor("H")).toBe("danger");
      expect(getFlagLabel("H")).toBe("High");
      expect(getFlagIcon("H")).toBe("mdi:trending-up");
    });

    it("should handle L flag consistently", () => {
      expect(getFlagColor("L")).toBe("warning");
      expect(getFlagLabel("L")).toBe("Low");
      expect(getFlagIcon("L")).toBe("mdi:trending-down");
    });

    it("should handle N flag consistently", () => {
      expect(getFlagColor("N")).toBe("success");
      expect(getFlagLabel("N")).toBe("Normal");
      expect(getFlagIcon("N")).toBe("mdi:minus");
    });

    it("should handle unknown flags consistently", () => {
      const unknownFlag = "UNKNOWN";
      expect(getFlagColor(unknownFlag)).toBe("default");
      expect(getFlagLabel(unknownFlag)).toBe(unknownFlag);
      expect(getFlagIcon(unknownFlag)).toBeNull();
    });
  });
});
