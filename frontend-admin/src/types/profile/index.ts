export interface User {
  id: number;
  identityNumber?: string | null;
  roleId: number | null;
  email: string;
  fullName?: string | null;
  role?: string | undefined;
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: string | undefined;
  phone?: string | null;
  avatarUrl?: string | null;
  banned?: number | boolean;
}

export interface UpdateProfilePayload {
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  gender?: "male" | "female" | "other" | string;
  // use ISO date string (e.g. "2025-10-17")
  dateOfBirth?: string;
  roleId?: number;
}

export interface UpdateProfileResponse {
  statusCode: number;
  error?: string;
  message?: string;
  data: {
    email: string;
    fullName: string;
    id: number;
    role?: string;
    address?: string;
    avatarUrl?: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
  };
}

export interface UpdateAvatarPayload {
  avatarUrl: string;
}
