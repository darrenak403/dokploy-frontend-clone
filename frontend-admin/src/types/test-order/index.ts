import { Comment } from "../test-result";

// Create and Update Patient helpers
export type PriorityOption = {
  key: "low" | "medium" | "high";
  label: string;
};

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
  instrumentId?: number | null;
  instrumentName?: string | null;
  runAt?: string | null; // ISO datetime or null
  runBy?: string | null;
  createdBy?: string | null;
  deleted?: number | boolean;
  results?: string | null;
  comments?: Comment[];
}

export interface CreateTestOrderPayload {
  patientId?: number;
  priority?: string;
  instrumentId?: number;
  runBy?: number;
}

export interface CreateTestOrderResponse {
  status?: number;
  error?: string | null;
  message?: string | null;
  data: TestOrder;
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
    instrumentId?: number | null;
    instrumentName?: string | null;
    createdBy?: string | null;
    runBy?: string | null;
    status?: string | null;
    createdAt?: string | null;
  };
}
