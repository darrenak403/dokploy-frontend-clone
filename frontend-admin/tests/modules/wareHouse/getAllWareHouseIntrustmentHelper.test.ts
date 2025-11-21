import {
  getStatusColor,
  getStatusText,
} from "@/modules/wareHouse/getAllWareHouseIntrustmentHelper";

describe("Warehouse Instrument Helper Functions", () => {
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

    it("should return original status for unknown status", () => {
      expect(getStatusText("UNKNOWN")).toBe("UNKNOWN");
      expect(getStatusText("PENDING")).toBe("PENDING");
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
      expect(getStatusColor("PENDING")).toBe("default");
    });
  });
});
