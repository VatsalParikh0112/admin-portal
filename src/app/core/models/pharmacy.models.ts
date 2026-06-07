export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type AccountStatus = 'active' | 'warned' | 'disabled';

export interface PharmacyAddress {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface PharmacyWarning {
  message: string;
  at: string;
}

export interface Pharmacy {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: PharmacyAddress;
  openingHours?: string;
  npiNumber?: string;
  npiVerified?: boolean;
  npiRegistryName?: string;
  stateLicenseNumber?: string;
  licenseState?: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  plan?: string;
  accountStatus?: AccountStatus;
  warnings?: PharmacyWarning[];
  disabledReason?: string;
  isActive: boolean;
}
