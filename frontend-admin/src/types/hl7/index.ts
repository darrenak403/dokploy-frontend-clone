export interface OBXRow {
  id: string;
  testName: string;
  testCode: string;
  testValue: number;
  referenceRange: string;
  unit: string;
  status: "Normal" | "High" | "Low" | "Critical";
}

export interface MSHInfo {
  sendingApp: string;
  sendingFacility: string;
  receivingApp: string;
  receivingFacility: string;
  messageType: string;
  hl7Version: string;
}

export interface OBRInfo {
  accessionNumber: string;
  testType: string;
  testName: string;
  observationDateTime: string;
}

export interface PIDInfo {
  id: number;
  patientCode: string;
  patientName: string;
  dateOfBirth: string;
  gender: string;
}

export interface HL7Message {
  patientId: string;
  patientName: string;
  dateOfBirth: string;
  tests: OBXRow[];
}

export type ResultStatus = "Normal" | "High" | "Low" | "Critical";

export const BLOOD_TEST_TEMPLATES = {
  hemoglobin: {
    name: "Hemoglobin",
    unit: "g/dL",
    referenceRange: { min: 13.5, max: 17.5 },
  },
  glucose: {
    name: "Glucose",
    unit: "mg/dL",
    referenceRange: { min: 70, max: 100 },
  },
  cholesterol: {
    name: "Cholesterol",
    unit: "mg/dL",
    referenceRange: { min: 125, max: 200 },
  },
  creatinine: {
    name: "Creatinine",
    unit: "mg/dL",
    referenceRange: { min: 0.6, max: 1.2 },
  },
  potassium: {
    name: "Potassium",
    unit: "mEq/L",
    referenceRange: { min: 3.5, max: 5.0 },
  },
};

export const RESULT_STATUS = {
  NORMAL: "Normal",
  HIGH: "High",
  LOW: "Low",
  CRITICAL: "Critical",
} as const;
