export const getStatusText = (
  deleted?: number | boolean
): "Active" | "Inactive" => {
  if (deleted === 1 || deleted === true) return "Inactive";
  return "Active";
};

export const getGenderLabel = (g?: string) => {
  if (!g) return "";
  const low = g.toString().toLowerCase();
  if (low === "male") return "Nam";
  if (low === "female") return "Nữ";
  if (low === "other") return "Khác";
  return g;
};

export const genderKeyToLabel = (g?: string) => {
  return getGenderLabel(g);
};

export const getRoleLabel = (g?: string) => {
  if (!g) return "";
  const low = g.toString().toLowerCase();
  if (low === "role_admin") return "Quản trị viên";
  else if (low === "role_manager") return "Quản lý";
  else if (low === "role_staff") return "Nhân viên";
  else if (low === "role_doctor") return "Bác sĩ";
  else if (low === "role_patient") return "Bệnh nhân";
  else if (!low.trim()) return "Khách hàng";
  return g;
};

export const genderRoleLabel = (g?: string) => {
  return getRoleLabel(g);
};
