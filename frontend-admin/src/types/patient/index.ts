export type PatientStatusFilter = "all" | "active" | "inactive";
// PatientList helpers
export interface Patient {
  id?: number;
  userId?: number;
  identityNumber: string | null;
  patientCode?: string;
  fullName?: string;
  yob?: string;
  gender?: string | undefined;
  address?: string;
  phone?: string;
  email?: string;
  createdBy: string;
  createdAt: string;
  modifiedBy?: string;
  deleted?: number | boolean;
}

export interface PatientAccessionNumber {
  statusCode: number;
  error: string;
  message: string;
  data: {
    id?: number;
    userId?: number;
    patientCode?: string;
    fullName?: string;
    yob?: string;
    gender?: string;
    address?: string;
    phone?: string;
    email?: string;
    createdBy: string;
    createdAt: string;
    modifiedBy?: string;
    deleted?: number | boolean;
  };
}
