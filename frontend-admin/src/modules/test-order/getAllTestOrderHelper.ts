import { PriorityOption, TestOrder } from "@/types/test-order";

export type TestOrderStatusFilter =
  | "all"
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

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

export const getStatusColor = (
  status?: string
): "success" | "default" | "danger" | "warning" => {
  if (!status) return "default";
  const s = String(status).toUpperCase().replace(/_/g, " ").trim();
  if (s === "COMPLETED") return "success";
  if (s === "CANCELLED") return "danger";
  if (s === "PENDING") return "warning";
  if (s === "IN PROGRESS" || s === "IN_PROGRESS") return "warning";
  // mark reviewed states as success (positive)
  if (s === "REVIEWED") return "success";
  if (s === "AI REVIEWED") return "success";
  return "default";
};

export const getStatusText = (status?: string): string => {
  if (!status) return "Unknown";
  return String(status);
};

export const getPriorityColor = (
  priority?: PriorityOption | string
): "success" | "default" | "danger" | "warning" => {
  if (!priority) return "default";
  let p = "";
  if (typeof priority === "string") p = priority;
  else if (priority && typeof (priority as PriorityOption).key === "string")
    p = (priority as PriorityOption).key;
  else if (priority && typeof (priority as PriorityOption).label === "string")
    p = (priority as PriorityOption).label;

  const up = String(p).toUpperCase();
  if (up === "HIGH") return "danger";
  if (up === "MEDIUM") return "warning";
  if (up === "LOW") return "success";
  return "default";
};

export const getPriorityText = (priority?: PriorityOption | string): string => {
  if (!priority) return "-";
  if (typeof priority === "string") return priority;
  if ((priority as PriorityOption).label)
    return (priority as PriorityOption).label;
  return String(priority);
};

export const priorityTokenToClass = (
  token?: "success" | "default" | "danger" | "warning"
) => {
  switch (token) {
    case "success":
      return "text-green-600";
    case "warning":
      return "text-yellow-500";
    case "danger":
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};

export const formatDate = (raw?: unknown): string => {
  if (raw === undefined || raw === null) return "-";
  const s = String(raw).trim();
  if (!s || s.toLowerCase() === "null") return "-";

  const dt = s.match(
    /^([0-9]{2})[\/\-]([0-9]{2})[\/\-]([0-9]{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (dt) {
    const day = Number(dt[1]);
    const month = Number(dt[2]) - 1;
    const year = Number(dt[3]);
    const hours = dt[4] ? Number(dt[4]) : 0;
    const minutes = dt[5] ? Number(dt[5]) : 0;
    const seconds = dt[6] ? Number(dt[6]) : 0;
    const d = new Date(year, month, day, hours, minutes, seconds);
    if (!isNaN(d.getTime())) return d.toLocaleString();
  }

  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toLocaleString();

  return "-";
};

export const parseDateOnly = (raw?: unknown): Date | null => {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const dm = s.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
  if (dm) {
    const day = Number(dm[1]);
    const month = Number(dm[2]) - 1;
    const year = Number(dm[3]);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime()))
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]) - 1;
    const day = Number(iso[3]);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime()))
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  const d = new Date(s);
  if (!isNaN(d.getTime()))
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return null;
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
    return today.getFullYear() - 1;
  }

  return null;
};

export const formatTestId = (id?: number | string): string => {
  if (id === undefined || id === null) return "-";
  return String(id);
};

export const filterTestOrders = (
  testOrders: TestOrder[],
  query: string,
  status: TestOrderStatusFilter = "all",
  priority?: PriorityOption | string
): TestOrder[] => {
  const q = (query || "").trim().toLowerCase();

  let list = testOrders;
  if (status !== "all") {
    list = list.filter((t) => (t.status || "").toUpperCase() === status);
  }

  if (priority) {
    list = list.filter(
      (t) =>
        String(t.priority || "").toUpperCase() ===
        String(priority).toUpperCase()
    );
  }

  if (!q) return list;

  return list.filter((t) => {
    const idMatch =
      t.patientId !== undefined && String(t.patientId).includes(q);
    const nameMatch =
      !!t.patientName && t.patientName.toLowerCase().includes(q);
    const emailMatch = !!t.email && t.email.toLowerCase().includes(q);
    const phoneMatch = !!t.phone && t.phone.toLowerCase().includes(q);
    const addressMatch = !!t.address && t.address.toLowerCase().includes(q);
    const createdByMatch =
      !!t.createdBy && t.createdBy.toLowerCase().includes(q);
    const runByMatch = !!t.runBy && t.runBy.toLowerCase().includes(q);
    const statusMatch = !!t.status && t.status.toLowerCase().includes(q);

    return (
      idMatch ||
      nameMatch ||
      emailMatch ||
      phoneMatch ||
      addressMatch ||
      createdByMatch ||
      runByMatch ||
      statusMatch
    );
  });
};
