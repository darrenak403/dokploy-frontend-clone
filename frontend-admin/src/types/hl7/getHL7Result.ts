export interface GetTestResultParameters {
  sequence?: number;
  paramCode?: string;
  paramName?: string;
  value?: number | null;
  unit: string;
  refRange?: string;
  flag?: string | null;
}

export interface Comments {
  id?: number;
  testResultId?: number;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetHL7ResultResponse {
  statusCode: number;
  error: string | null;
  message: string | null;
  data: {
    accessionNumber?: string;
    instrument?: string;
    status?: string;
    parameters: GetTestResultParameters[];
    comments: Comments[];
  };
}
