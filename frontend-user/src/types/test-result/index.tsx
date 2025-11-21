export interface TestResultParameters {
  sequence?: number;
  paramCode?: string;
  paramName?: string;
  value?: string | number;
  unit?: string;
  refRange?: string;
  flag?: string;
}

export interface Comment {
  commentId?: number;
  commentContent?: string;
  createdAt?: string;
  doctorName?: string;
  testOrderId?: number;
  testResultId?: number;
}

export interface TestResult {
  statusCode?: string;
  errors?: string | null;
  message?: string | null;
  data?: {
    accessionNumber?: string;
    instrument?: string;
    status?: string;
    parameters?: TestResultParameters[];
  };
}

export interface CommentUpdate {
  commentId: number;
  content?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface TestResultProps {
  testOrderId: string;
  accessionNumber: string;
}

export interface BloodTestReportContentProps {
  patientName?: string;
  address?: string;
  birthYear?: string;
  gender?: string;
  accessionNumber?: string;
  instrument?: string;
  testDate?: string;
  parameters: TestResultParameters[];
  doctorComments: Comment[];
  doctorName?: string;
  signatureDate?: string;
  status?: string;
  phone?: string;
  email?: string;
}
