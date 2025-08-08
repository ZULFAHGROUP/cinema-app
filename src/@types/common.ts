export interface CountryIsoOption {
  code: string;
  code3: string;
  name: string;
  number: string;
}

export interface GenderOption {
  id: number;
  name: string;
}

export interface ReligionOption {
  id: number;
  name: string;
}

export interface GenderOption {
  id: number;
  name: string;
}

export const UtilityBillApprovalStatus = {
  Default: 1,
  Approved: 2,
  Denied: 3,
  NotUploaded: 0,
};

export interface ThunkApiConfigRejectValue<T> {
  rejectValue: T;
}

export const MeansOfIdentificationStatus = {
  Default: 1,
  Approved: 2,
  Denied: 3,
  RejectSelfie: 4,
  NotUploaded: 0,
};

export interface CustomerDetails {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Define properties based on actual structure
}

export interface AuthState {
  data: {
    customerDetails?: CustomerDetails;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  loginLoading: boolean;
  loginError: string | null;
}

// Define the structure of the API response
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  status: boolean;
  message?: string;
  data?: T;
}
