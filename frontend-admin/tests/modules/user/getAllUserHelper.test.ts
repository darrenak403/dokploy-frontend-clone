import {
  genderKeyToLabel,
  genderRoleLabel,
  getGenderLabel,
  getRoleLabel,
  getStatusText,
} from "@/modules/user/getAllUserHelper";

describe("User Helper Functions", () => {
  describe("getStatusText", () => {
    it('should return "Inactive" for deleted users', () => {
      expect(getStatusText(1)).toBe("Inactive");
      expect(getStatusText(true)).toBe("Inactive");
    });

    it('should return "Active" for active users', () => {
      expect(getStatusText(0)).toBe("Active");
      expect(getStatusText(false)).toBe("Active");
      expect(getStatusText(undefined)).toBe("Active");
    });
  });

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

    it("should return empty string for undefined or empty", () => {
      expect(getGenderLabel(undefined)).toBe("");
      expect(getGenderLabel("")).toBe("");
    });

    it("should return original value for unknown gender", () => {
      expect(getGenderLabel("unknown")).toBe("unknown");
    });
  });

  describe("genderKeyToLabel", () => {
    it("should call getGenderLabel", () => {
      expect(genderKeyToLabel("male")).toBe("Nam");
      expect(genderKeyToLabel("female")).toBe("Nữ");
    });
  });

  describe("getRoleLabel", () => {
    it("should return Vietnamese label for role_admin", () => {
      expect(getRoleLabel("role_admin")).toBe("Quản trị viên");
      expect(getRoleLabel("ROLE_ADMIN")).toBe("Quản trị viên");
    });

    it("should return Vietnamese label for role_manager", () => {
      expect(getRoleLabel("role_manager")).toBe("Quản lý");
      expect(getRoleLabel("ROLE_MANAGER")).toBe("Quản lý");
    });

    it("should return Vietnamese label for role_staff", () => {
      expect(getRoleLabel("role_staff")).toBe("Nhân viên");
      expect(getRoleLabel("ROLE_STAFF")).toBe("Nhân viên");
    });

    it("should return Vietnamese label for role_doctor", () => {
      expect(getRoleLabel("role_doctor")).toBe("Bác sĩ");
      expect(getRoleLabel("ROLE_DOCTOR")).toBe("Bác sĩ");
    });

    it("should return Vietnamese label for role_patient", () => {
      expect(getRoleLabel("role_patient")).toBe("Bệnh nhân");
      expect(getRoleLabel("ROLE_PATIENT")).toBe("Bệnh nhân");
    });

    it('should return "Khách hàng" for whitespace-only string', () => {
      expect(getRoleLabel("   ")).toBe("Khách hàng");
    });

    it("should return empty string for undefined", () => {
      expect(getRoleLabel(undefined)).toBe("");
    });

    it("should return original value for unknown role", () => {
      expect(getRoleLabel("unknown_role")).toBe("unknown_role");
    });
  });

  describe("genderRoleLabel", () => {
    it("should call getRoleLabel", () => {
      expect(genderRoleLabel("role_admin")).toBe("Quản trị viên");
      expect(genderRoleLabel("role_doctor")).toBe("Bác sĩ");
    });
  });
});
