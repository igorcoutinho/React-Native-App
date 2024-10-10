import { useMemo } from 'react';
import { useUser } from '../../states/User';
import { useWhipContext } from '../../states/Whip';

export interface ICheckoutData {
  toAccountId: string;
  fromAccountId: string;
  whipId: string;
  userId: string;
  userPhoneNumber: string;
  userEmail: string;
  userDisplayName: string;
  details: {
    howMuchIWantToUpload: number;

    myPersonalBalance: number;
    myPersonalBalanceAfter: number;

    differenceToPayByPersonalBalance: number;
    differenceToPayByGateway: number;
    differenceToPayByGatewayFee: number;

    totalToPayByGateway: number;
    totalToPayByPersonalBalance: number;
    totalToPay: number;

    whipBalanceNow: number;
    whipBalanceAfter: number;
    whipWillReceive: number;

    currentSubscriptionFee: number;

    uploadFeeDiscount: number;

    uploadFeeFixed: number;
    uploadFeeMultiplier: number;

    subscriptionMonthlyFee: number;
  };
}

function subtractPercentage(value: number, percentage: number) {
  const percentageAmount = (value * percentage) / 100;
  const result = value - percentageAmount;
  console.log(result, value, percentage)
  return result;
}

export const useWhipFundsCheckout = (howMuchIWantToUpload: number): ICheckoutData => {
  const { whip } = useWhipContext();
  const { user } = useUser();

  const isOwner = whip?.isOwner;

  const whipBalance = useMemo(() => whip?.balance || 0, []);

  const uploadFeeDiscount = user.admin?.fees?.uploadFeeDiscount;

  const uploadFeeFixed = user.admin?.fees?.uploadFeeFixed;
  const uploadFeeMultiplier = user.admin?.fees?.uploadFeeMultiplier;

  const subscriptionMonthlyFee = user.admin?.fees?.subscriptionMonthlyFee;

  const oldWhip = whip.subscription?.status === undefined;

  const haveSubscription = whip.subscription?.type !== undefined;

  const subscriptionActive = whip.subscription?.status === 'ACTIVE';
  const subscriptionPending = whip.subscription?.status === 'PENDING' || oldWhip;
  const subscriptionExpired = whip.subscription?.status === 'EXPIRED';

  const shouldIPaySubscription = isOwner && !subscriptionActive;

  const getPaymentGatewayFee = (amount: number) => {
    const percentageAddition = amount * subtractPercentage(uploadFeeMultiplier, uploadFeeDiscount);
    const result = amount + percentageAddition + subtractPercentage(uploadFeeFixed, uploadFeeDiscount);
    return Number((amount > 0 ? result - amount : amount).toFixed(2));
  };

  const fixed = (value: number) => Number((value || 0).toFixed(2))

  const currentSubscriptionFee = shouldIPaySubscription ? subscriptionMonthlyFee : 0;

  const myPersonalBalance = Number(user?.account?.balance || 0);
  const myPersonalBalanceAfter = myPersonalBalance - howMuchIWantToUpload <= 0 ? 0 : myPersonalBalance - howMuchIWantToUpload;
  const differenceToPayByPersonalBalance = myPersonalBalance < howMuchIWantToUpload ? myPersonalBalance : howMuchIWantToUpload;

  const differenceToPayByGateway = differenceToPayByPersonalBalance < howMuchIWantToUpload ? howMuchIWantToUpload - differenceToPayByPersonalBalance : 0;
  const differenceToPayByGatewayFee = getPaymentGatewayFee(differenceToPayByGateway);

  const totalToPayByGateway = differenceToPayByGateway + differenceToPayByGatewayFee;
  const totalToPayByPersonalBalance = differenceToPayByPersonalBalance;
  const totalToPay = totalToPayByGateway + totalToPayByPersonalBalance;

  const whipWillReceive = currentSubscriptionFee > 0 ? howMuchIWantToUpload - currentSubscriptionFee : howMuchIWantToUpload;

  const whipBalanceNow = whipBalance;
  const whipBalanceAfter = whipBalanceNow + whipWillReceive;

  // console.log('----------------------------------------------');
  // console.log('howMuchIWantToUpload', howMuchIWantToUpload);
  // console.log('myPersonalBalance', myPersonalBalance);
  // console.log('myPersonalBalanceAfter', myPersonalBalanceAfter);
  // console.log('differenceToPayByPersonalBalance', differenceToPayByPersonalBalance);
  // console.log('differenceToPayByGateway', differenceToPayByGateway);
  // console.log('differenceToPayByGatewayFee', differenceToPayByGatewayFee);
  // console.log('totalToPayByGateway', totalToPayByGateway);
  // console.log('totalToPayByPersonalBalance', totalToPayByPersonalBalance);
  // console.log('totalToPay', totalToPay);
  // console.log('whipBalanceNow', whipBalanceNow);
  // console.log('whipBalanceAfter', whipBalanceAfter);
  // console.log('currentSubscriptionFee', currentSubscriptionFee);
  // console.log('whipWillReceive', whipWillReceive);

  return {
    toAccountId: whip?.card?.accountId || null,
    fromAccountId: user?.account?.provider?.accountId,

    whipId: whip?.id,
    userId: user?.uid,

    userPhoneNumber: user?.phoneNumber,
    userEmail: user?.email,
    userDisplayName: user?.displayName,

    details: {
      howMuchIWantToUpload: fixed(howMuchIWantToUpload),

      myPersonalBalance: fixed(myPersonalBalance),
      myPersonalBalanceAfter: fixed(myPersonalBalanceAfter),

      differenceToPayByPersonalBalance: fixed(differenceToPayByPersonalBalance),
      differenceToPayByGateway: fixed(differenceToPayByGateway),
      differenceToPayByGatewayFee: fixed(differenceToPayByGatewayFee),

      totalToPayByGateway: fixed(totalToPayByGateway),
      totalToPayByPersonalBalance: fixed(totalToPayByPersonalBalance),
      totalToPay: fixed(totalToPay),

      whipBalanceNow: fixed(whipBalanceNow),
      whipBalanceAfter: fixed(whipBalanceAfter),
      whipWillReceive: fixed(whipWillReceive),

      currentSubscriptionFee,

      uploadFeeDiscount,

      uploadFeeFixed,
      uploadFeeMultiplier,

      subscriptionMonthlyFee,
    },
  };
};
