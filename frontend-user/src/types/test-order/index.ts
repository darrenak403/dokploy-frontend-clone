import { Comment } from "../test-result";

// Create and Update Patient helpers
export type PriorityOption = {
  key: "low" | "medium" | "high";
  label: string;
};

export const TestTypeOptions = [{ key: "cbc", label: "Complete Blood Count" }];

export const InstrumentOptions = [{ key: "hl7", label: "HL7" }];

export interface TestOrder {
  id: number;
  accessionNumber: string;
  patientId: number;
  patientName: string;
  email?: string | null;
  address?: string | null;
  phone?: string | null;
  gender?: string | null;
  yob?: string | null; // date of birth (string)
  age?: number | null;
  status?: string;
  createdAt?: string; // timestamp string
  priority?: PriorityOption | null;
  testType?: string | null;
  instrument?: string | null;
  runAt?: string | null; // ISO datetime or null
  runBy?: string | null;
  createdBy?: string | null;
  deleted?: number | boolean;
  results?: string | null;
  comments?: Comment[];
}

export interface UpdateTestOrderPayload {
  fullName?: string;
  yob?: string;
  gender?: string;
  address?: string;
  phone?: string | number;
  runBy?: number;
}

export interface UpdateTestOrderResponse {
  statusCode?: number;
  error?: string | null;
  message?: string | null;
  data?: {
    id: number;
    patientId: number;
    patientName: string;
    email?: string | null;
    address?: string | null;
    phone?: string | null;
    gender?: string | null;
    yob?: string | null; // ISO date or yyyy-mm-dd
    age?: number | null;
    priority?: "LOW" | "MEDIUM" | "HIGH" | string;
    testType?: string | null;
    instrument?: string | null;
    createdBy?: string | null;
    runBy?: string | null;
    status?: string | null;
    createdAt?: string | null;
  };
}
