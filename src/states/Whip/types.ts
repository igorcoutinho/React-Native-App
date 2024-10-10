import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export enum WhipFriendInviteStatus {
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  NEW = 'NEW'
}

export enum WhipFriendActionType {
  INVITE = 'INVITE',
  REFUND = 'REFUND',
  REMOVE = 'REMOVE',
  REQUEST = 'REQUEST',
  RESEND = 'RESEND',
}

export interface IWhipFriend {
  id?: string;

  active?: boolean;

  balance?: number;

  deposits?: number;
  refunds?: number;
  budget?: number | string;

  createdAt?: FirebaseFirestoreTypes.FieldValue | Date;
  displayName?: any;
  email?: string;
  hash?: {
    activationSite?: string;
    activationDeepLink?: string;
  };
  invite: WhipFriendInviteStatus;
  invitedBy?: string;
  phoneNumber?: string;
  updatedAt?: FirebaseFirestoreTypes.FieldValue | Date;
  userId?: string;
  whipId?: string;
}

export interface IWhipPublic {
  id?: string;

  archived?: boolean;

  attachment?: string;
  color?: string;
  description?: string;

  startAt?: Date | null;
  endAt?: Date | null;

  creatorId?: string;
  creatorName?: string;

  ownerId?: string;
  ownerName?: string;

  type?: string;

  name?: string;

  friends?: FirebaseFirestoreTypes.FieldValue[] | string[]; // Emails
  chats?: FirebaseFirestoreTypes.FieldValue[] | string[]; // Emails

  isNew?: boolean; // Local prop
  isOwner?: boolean; // Local prop
  subscriptionActive?: boolean; // Local prop
  subscriptionPending?: boolean; // Local prop
  subscriptionExpired?: boolean; // Local prop

  createdAt?: FirebaseFirestoreTypes.FieldValue | Date;
  updatedAt?: FirebaseFirestoreTypes.FieldValue | Date;

  hash?: {
    code?: string;
    password?: string;
    expiresAt?: FirebaseFirestoreTypes.FieldValue | Date;
  };

  disabled?: boolean;
}

export interface IWhipPrivate {
  balance?: number;
  deposits?: number;
  refunds?: number;

  card?: {
    accountId?: string;
    cardId?: string;
    expiration?: {
      month?: string;
      year?: string;
    };
    maskedCardNumber?: string;
    status?: 'PENDING' | 'READY' | 'INACTIVE' | 'PROCESSING' | 'BLOCKED';
  };
  subscription?: {
    status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'EXPIRED';
    type?: 'FREE' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    activatedAt?: FirebaseFirestoreTypes.FieldValue | Date;
    expiresAt?: FirebaseFirestoreTypes.FieldValue | Date;
  };
}

export interface IWhip extends IWhipPublic, IWhipPrivate { }

export enum WhipEventType {
  PAYMENT_CREATED = 'PAYMENT_CREATED', //
  PAYMENT_SUCCEEDED = 'PAYMENT_SUCCEEDED', // -> charge.succeeded
  PAYMENT_FAILED = 'PAYMENT_FAILED', //
  PAYMENT_CANCELLED = 'PAYMENT_CANCELLED', //
  PAYMENT_EXPIRED = 'PAYMENT_EXPIRED', //
  PAYMENT_REJECTED = 'PAYMENT_REJECTED', //
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED',

  TRANSACTION_SUCCEEDED = 'TRANSACTION_SUCCEEDED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  TRANSACTION_REFUNDED = 'TRANSACTION_REFUNDED',

  TRANSFER_TO_WHIP_SUCCEEDED = 'TRANSFER_TO_WHIP_SUCCEEDED',
  TRANSFER_FROM_ACCOUNT_SUCCEEDED = 'TRANSFER_FROM_ACCOUNT_SUCCEEDED',
}

export enum WhipEventOrigin {
  ENFUCE = 'ENFUCE',
  STRIPE = 'STRIPE',
  WHIPAPP = 'WHIPAPP',
}

export enum WhipEventProvider {
  ENFUCE = 'ENFUCE',
  STRIPE = 'STRIPE',
  WHIPAPP = 'WHIPAPP',
}

export interface IWhipEventData {
  accountId?: string;
  cardId?: string;
  whipId?: string;

  userId?: string;
  userDisplayName?: string;
  userEmail?: string;
  userPhoneNumber?: string;

  origin?: WhipEventOrigin;

  transactionId?: string;
  originalId?: string;
  originalTransactionId?: string;

  billingDetails?: {
    name?: string;
  };

  transactionDetails?: {
    amount?: number;

    amountToPayWithMoney?: number;
    amountToPayWithPersonalBalance?: number;
    personalBalanceAccountId?: string;

    currency?: string;

    receiptUrl?: string;

    method?: 'card';

    metadata?: {
      brand?: string;
      country?: string;
      expMonth?: string;
      expYear?: string;
      last4?: string;
    };
  };
}

export interface IWhipEvent {
  title: string;
  type: WhipEventType;
  description?: string;
  data: IWhipEventData;
  createdAt: FirebaseFirestoreTypes.FieldValue | Date | any;
}

export enum WhipFilterButton {
  All = 'All',
  Master = 'Master',
  Invited = 'Member',
  // Closed = 'Closed',
  Archived = 'Archived',
}
