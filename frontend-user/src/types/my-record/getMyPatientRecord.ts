export interface MyPatientRecordResponse {
  statusCode: number;
  message: string;
  data: PatientData[];
}

export interface PatientData {
  id?: number;
  userId?: number;
  patientCode?: string;
  fullName?: string;
  yob?: string;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  createdBy?: string;
  createdAt?: string;
  modifiedBy?: string;
}

export interface MyInformationProps {
  patientRecord: PatientData | undefined;
}

//module
export const getInitials = (name?: string) =>
  (name || "U")
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const getAge = (yob?: string) => {
  if (!yob) return undefined;
  const s = String(yob).trim();

  // Split by common separators
  const parts = s.split(/[\/\-\.\s]/);

  // If format mm/dd/yyyy or dd/mm/yyyy -> year is parts[2]
  // If format yyyy-mm-dd -> year is parts[0]
  let yearStr = "";
  if (parts.length === 3) {
    yearStr = parts[2];
  } else if (/^\d{4}$/.test(parts[0])) {
    yearStr = parts[0];
  } else {
    // fallback: try last 4 chars
    yearStr = s.slice(-4);
  }

  const year = parseInt(yearStr, 10);
  if (isNaN(year)) return undefined;

  const now = new Date();
  let age = now.getFullYear() - year;

  // If we have month/day info, calculate exact age
  if (parts.length === 3) {
    // assume mm/dd/yyyy or dd/mm/yyyy — try detect which is month by value
    const p0 = parseInt(parts[0], 10);
    const p1 = parseInt(parts[1], 10);
    let month = p0 - 1;
    let day = p1;
    // if first part > 12, likely dd/mm/yyyy -> swap
    if (p0 > 12 && p1 <= 12) {
      month = p1 - 1;
      day = p0;
    }
    if (!isNaN(month) && !isNaN(day)) {
      const dob = new Date(year, month, day);
      if (!isNaN(dob.getTime())) {
        const m = now.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
      }
    }
  }

  return age;
};
