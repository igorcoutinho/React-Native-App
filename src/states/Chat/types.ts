import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface IWhipChat {
    id?: string;
    active?: boolean;  
    createdAt?: FirebaseFirestoreTypes.FieldValue | Date;
    email?: string;
    updatedAt?: FirebaseFirestoreTypes.FieldValue | Date;
    userId?: string;
    whipId?: string;
    description?: string;
    message?: string;
    displayName?: string;
  }
