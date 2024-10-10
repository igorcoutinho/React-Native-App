import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export enum INotificationActionType {
  DEEPLINK = 'DEEPLINK',
  GOTO = 'GOTO',
  INVITE = 'INVITE',
  MESSAGE = 'MESSAGE',
  REMOVE = 'REMOVE'
}

export interface INotification {
  id: string;
  actionType: INotificationActionType;
  actionLabel: string | null;
  actionData: any | null;
  actionPayload: any | null;
  title: string;
  body: string;

  fromUserId: string;
  toUserId: string;

  origin: string;

  read: boolean;
  deleted?: boolean;
  createdAt: FirebaseFirestoreTypes.FieldValue | Date | any;
}

export interface INotificationsContext {
  isLoading: boolean;
  notifications: INotification[];
  unread: number;
}

/**
  * For control the buttons on notifications page
*/
export enum NotificationTypesButton {
  //All = 'All',
  Recent = 'Unread',
  Read = 'Read',
}


/**
  * For control the buttons on notifications page
*/
export enum NotificationsType {
  InviteFriend = 'InviteFriend',
}