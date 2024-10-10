import FirebaseFirestore from '@react-native-firebase/firestore';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import { AddressCollectionMode, CollectionMode } from '@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet';
import axios from 'axios';
import { Alert } from 'react-native';
import { analytics } from '../..';
import { setAPIUrl } from '../../constants';
import { InternalNavigationNames } from '../../navigation/types';
import { useUser } from '../../states/User';
import { useWhipContext } from '../../states/Whip';
import { useViewLocker } from '../ViewLocker';
import { ICheckoutData } from './useWhipFundsCheckout';

export enum UploadType {
  PAYMENT = 'PAYMENT',
  TRANSFER = 'TRANSFER',
  PAYMENT_AND_TRANSFER = 'PAYMENT_AND_TRANSFER',
}

export const useWhipInitiateUpload = (checkout: ICheckoutData) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { toggleLocker } = useViewLocker();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const { whip } = useWhipContext();
  const { user } = useUser();

  const createUpload = async (checkout: ICheckoutData) => {
    const isPayAndTransfer = checkout.details.totalToPayByGateway > 0 && checkout.details.totalToPayByPersonalBalance > 0;
    const isPay = checkout.details.totalToPayByGateway > 0 && checkout.details.differenceToPayByPersonalBalance === 0;
    const isTransfer = checkout.details.totalToPayByGateway === 0 && checkout.details.totalToPayByPersonalBalance > 0;
    try {
      const collection = FirebaseFirestore().collection('Uploads');
      const ref = collection.doc();
      await ref.set({
        checkout,
        pending: {
          fromPersonalBalance: checkout.details.totalToPayByPersonalBalance,
          fromGateway: checkout.details.totalToPayByGateway,
        },
        status: 'PENDING',
        destination: 'WHIP_ACCOUNT',
        type: isPayAndTransfer ? 'PAYMENT_AND_TRANSFER' : isPay ? 'PAYMENT' : isTransfer ? 'TRANSFER' : 'UNKNOWN',
        createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
      });
      return ref.id;
    } catch (error) {
      console.log('Error captured in useWhipInitiateUpload createTransfer', error);
      throw error;
    }
  };

  const cancelUpload = async (uploadId: string) => {
    try {
      const collection = FirebaseFirestore().collection('Uploads');
      const ref = collection.doc(uploadId);
      await ref.set({
        status: 'CANCELLED',
        updatedAt: FirebaseFirestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      return ref.id;
    } catch (error) {
      console.log('Error captured in useWhipInitiateUpload createTransfer', error);
      throw error;
    }
  };

  const updateUpload = async (uploadId: string) => {
    try {
      const collection = FirebaseFirestore().collection('Uploads');
      const ref = collection.doc(uploadId);
      await ref.set({
        updatedAt: FirebaseFirestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      return ref.id;
    } catch (error) {
      console.log('Error captured in useWhipInitiateUpload createTransfer', error);
      throw error;
    }
  };

  const createIntent = async (checkout: ICheckoutData, uploadId: string) => {
    try {
      const intent = await axios.post(setAPIUrl('whipCreatePaymentIntentV2'), { checkout, uploadId });
      await initPaymentSheet({
        merchantDisplayName: 'Whipapp',
        paymentIntentClientSecret: intent.data.client_secret,
        allowsDelayedPaymentMethods: true,
        returnURL: 'whipapp://goto/myWhips',
        billingDetailsCollectionConfiguration: {
          name: 'always' as CollectionMode,
          email: 'always' as CollectionMode,
          phone: 'always' as CollectionMode,
          address: 'always' as AddressCollectionMode,
        },
        defaultBillingDetails: {
          name: user?.account?.firstName + ' ' + user?.account?.lastName,
          email: user?.account?.email,
          phone: user?.account?.phoneNumber,
          address: {
            city: user?.account?.address?.city,
            line1: user?.account?.address?.addressLine1,
            postalCode: user?.account?.address?.postalCode.replace(/\s/g, ''),
          },
        },
        applePay: { merchantCountryCode: 'US' },
      });
      const response = await presentPaymentSheet();
      const { error } = response;
      if (error) {
        Alert.alert(`Operation ${error.code}`, error.message);
        await cancelUpload(uploadId);
        toggleLocker(false);
      } else {
        Alert.alert('Success', 'Your order is confirmed!');
        toggleLocker(false);
        try {
          await analytics().logPurchase({
            value: checkout.details.totalToPay,
            currency: 'gbp',
            items: [
              {
                item_id: whip.id,
                item_name: whip.name,
                item_category: 'Whip',
                quantity: 1,
              },
            ],
          });
        } catch (error) { }
      }
      return intent?.data;
    } catch (error) {
      console.log('Error captured in useWhipInitiateUpload createIntent', error);
      throw error;
    }
  };

  const initiateUpload = async () => {
    const openPaymentGateway = checkout.details.totalToPayByGateway > 0;
    const haveTransfer = checkout.details.totalToPayByPersonalBalance > 0;
    console.log('useWhipInitiateUpload', checkout);
    toggleLocker(true);
    const uploadId = await createUpload(checkout);
    if (openPaymentGateway) {
      await createIntent(checkout, uploadId);
    }
    if (haveTransfer && !openPaymentGateway) {
      await updateUpload(uploadId);
    }
    try {
      navigation.navigate(InternalNavigationNames.WhipDetailsModal, {
        whipId: checkout.whipId,
        screen: InternalNavigationNames.WhipDetailsMain,
      });
    } catch (error) { }
    toggleLocker(false);
  };

  return {
    initiateUpload,
  };
};
