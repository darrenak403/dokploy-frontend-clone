import { Patient, PatientStatusFilter } from "@/types/patient";

export const getGenderLabel = (g?: string) => {
  if (!g) return "";
  const low = g.toString().toLowerCase();
  if (low === "male") return "Nam";
  if (low === "female") return "Nữ";
  if (low === "other") return "Khác";
  return g;
};

export const mapInputToGenderKey = (input?: string) => {
  if (!input) return "";
  const low = input.toString().toLowerCase().trim();
  if (["nam", "n", "male"].includes(low)) return "male";
  if (["nữ", "nu", "female"].includes(low)) return "female";
  if (["khác", "khac", "other"].includes(low)) return "other";
  return low;
};

export const genderKeyToLabel = (g?: string) => {
  return getGenderLabel(g);
};

export const getStatusColor = (
  deleted?: number | boolean
): "success" | "default" | "danger" => {
  if (deleted === 1 || deleted === true) return "danger";
  return "success";
};

export const getStatusText = (
  deleted?: number | boolean
): "Active" | "Inactive" => {
  if (deleted === 1 || deleted === true) return "Inactive";
  return "Active";
};

export const getStatusLabel = (g?: string) => {
  if (!g) return "";
  const low = g.toString().toLowerCase();
  if (low === "active") return "Đang hoạt động";
  if (low === "not active") return "Ngừng hoạt động";
  return g;
};

export const genderStatusLabel = (g?: string) => {
  return getStatusLabel(g);
};

export const formatPatientId = (id?: number | string): string => {
  if (id === undefined || id === null) return "-";
  return String(id);
};

export const computeBoundary = (filter: string) => {
  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (!filter || filter === "all") return null;

  if (filter === "30days") {
    const b = new Date(todayDate);
    b.setDate(b.getDate() - 30);
    return b;
  }

  if (filter === "6months") {
    const b = new Date(todayDate);
    b.setMonth(b.getMonth() - 6);
    return b;
  }

  if (filter === "1year") {
    // chỉ trả năm trước thôi, không cần object
    return today.getFullYear() - 1;
  }

  return null;
};

export const filterPatients = (
  patients: Patient[],
  query: string,
  status: PatientStatusFilter = "all"
): Patient[] => {
  const q = (query || "").trim().toLowerCase();

  const isDeleted = (p: Patient) => p.deleted === 1 || p.deleted === true;

  // filter by status first
  let list = patients;
  if (status === "active") {
    list = patients.filter((p) => !isDeleted(p));
  } else if (status === "inactive") {
    list = patients.filter((p) => isDeleted(p));
  }

  if (!q) return list;

  return list.filter((p) => {
    const idMatch = p.id !== undefined && String(p.id).includes(q);
    const fullNameMatch = !!p.fullName && p.fullName.toLowerCase().includes(q);
    const emailMatch = !!p.email && p.email.toLowerCase().includes(q);
    const phoneMatch = !!p.phone && p.phone.toLowerCase().includes(q);
    return idMatch || fullNameMatch || emailMatch || phoneMatch;
  });
};
