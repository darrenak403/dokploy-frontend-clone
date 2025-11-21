export interface HL7MessagePayload {
  hl7Message: string;
}

export interface TestResultParameters {
  id?: number;
  rawHl7Id?: string | null;
  sequence?: number;
  obxIdentifier?: string;
  paramCode?: string;
  paramName?: string;
  value?: number | null;
  unit: string;
  refRange?: string;
  flag?: string | null;
  computedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comments {
  commentId?: number;
  doctorName?: string;
  testOrderId?: number;
  testResultId?: number;
  commentContent?: string;
  createdAt?: string;
}

export interface HL7MessageResponse {
  statusCode: number;
  error: string | null;
  message: string | null;
  data: {
    id?: number;
    patientId?: number;
    accessionNumber?: string;
    instrumentName?: string;
    status?: string;
    parseHL7?: string;
    createdAt?: string;
    updatedAt?: string;
    parameters: TestResultParameters[];
    comments: Comments[];
  };
}
