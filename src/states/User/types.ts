export interface IUserAccount {
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    flatNumber?: string | null;
    houseNumber?: string | null;
    houseName?: string | null;
    postalCode?: string;
  };

  attachments?: {
    documentType?: string;
    documentImage?: string;
    selfieImage?: string;
  } | null;

  balance?: number;

  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dob?: Date | any;
  sourceOfFunds?: string;

  agreedToTerms?: boolean;

  createdAt?: Date | any;
  updatedAt?: Date | any;

  verification?: {
    logs: any;
    verified?: boolean;
    inconclusive?: boolean;
    error?: any;
  } | null;

  provider?: {
    name?: string;
    accountId?: string;
    customerId?: string;
  } | null;

  retry?: boolean;

  status?: null | 'PROCESSING' | 'FAILED' | 'COMPLETED';
}

export interface IUserProperties {
  preferences?: {};
  permissions?: {};
  onboarding?: any;
  deviceToken?: string;
}

export interface IUser {
  admin?: {
    fees?: {
      uploadFeeDiscount?: number;
      uploadFeeFixed?: number;
      uploadFeeMultiplier?: number;
      subscriptionMonthlyFee?: number;
    };
  };
  signedInAt: any;
  verified: any;
  account?: IUserAccount;
  properties?: IUserProperties;

  uid?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;

  emailVerified?: boolean;
  isAnonymous?: boolean;

  createdAt?: Date | any;
  updatedAt?: Date | any;
}

export interface IUserContext {
  getUserStorage?: () => IUser;
  isFetched?: boolean;
  isFetching?: boolean;
  isPending?: boolean;
  isSignedIn?: boolean;
  signedInAt?: Date | any;
  signOut?: () => Promise<void>;
  updateUserProperty?: (key: string, value: any) => Promise<void>;
  updateUserStorage?: (key: string, value: any) => void;
  user?: IUser | null;
  verified?: boolean;
}
