export interface CardImage {
  type: string;
  description: string;
  imageUrl: string;
}

export type FormType = {
  identifyNumber: string;
  fullName: string;
  birthDate: string;
  gender: string;
  nationality: string;
  recentLocation: string;
  issueDate: string;
  validDate: string;
  issuePlace: string;
  features: string;
  cardImages?: CardImage[];
};

export interface ScanIdentityCardData {
  identifyNumber: string;
  fullName: string;
  birthDate: string;
  gender: string;
  recentLocation: string;
  nationality: string;
  issueDate: string;
  validDate: string;
  issuePlace: string;
  features: string;
  cardImages?: CardImage[];
}

export interface ScanIdentityCardRequest {
  formData: FormData;
}

export interface ScanIdentityCardResponse {
  statusCode: number;
  error: null | string;
  message: string;
  data: ScanIdentityCardData | null;
}
