import dayjs from "dayjs";

export const getCurrentDate = () => {
  return dayjs().format("DD MM, YYYY");
};
const currentDate = new Date();
export const signatureDate = `Thủ Đức, ngày ${currentDate.getDate()} tháng ${
  currentDate.getMonth() + 1
} năm ${currentDate.getFullYear()}`;

export const convertToDateInputFormat = (ddmmyyyy: string): string => {
  if (!ddmmyyyy) return "";
  const parts = ddmmyyyy.split("/");
  if (parts.length !== 3) return "";
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};
//for string yyyy-mm-dd to dd/mm/yyyy
export const convertToDdMmYyyyFormat = (yyyymmdd: string): string => {
  if (!yyyymmdd) return "";
  const parts = yyyymmdd.split("-");
  if (parts.length !== 3) return "";
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

export const formatDateDisplay = (d: Date | null): string => {
  if (!d) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const parseDateOnly = (raw?: unknown): Date | null => {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).trim();
  if (!s) return null;
  // dd/MM/YYYY or dd/MM/YYYY HH:mm:ss
  const dm = s.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
  if (dm) {
    const day = Number(dm[1]);
    const month = Number(dm[2]) - 1;
    const year = Number(dm[3]);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime()))
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  // ISO-like: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS...
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]) - 1;
    const day = Number(iso[3]);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime()))
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  // fallback Date parser -> date-only
  const d = new Date(s);
  if (!isNaN(d.getTime()))
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return null;
};

//calc age from dd/mm/yyyy
export const calcAgeFromDate = (d?: Date | null): number | undefined => {
  if (!d) return undefined;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth();
  const day = today.getDate();
  if (m < d.getMonth() || (m === d.getMonth() && day < d.getDate())) age--;
  return age;
};

// Format ISO datetime to dd/MM/YYYY
export const formatDateTimeToDate = (dateTimeString?: string): string => {
  if (!dateTimeString) return "";
  return dayjs(dateTimeString).format("DD/MM/YYYY");
};

// Format ISO datetime to dd/MM/YYYY HH:mm
export const formatDateTime = (dateTimeString?: string): string => {
  if (!dateTimeString) return "";
  return dayjs(dateTimeString).format("DD/MM/YYYY HH:mm");
};

// Format ISO datetime to dd/MM/YYYY HH:mm:ss
export const formatDateTimeFull = (dateTimeString?: string): string => {
  if (!dateTimeString) return "";
  return dayjs(dateTimeString).format("DD/MM/YYYY HH:mm:ss");
};
