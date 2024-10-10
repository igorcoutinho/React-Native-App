import { faChampagneGlasses, faCreditCard, faFileInvoice, faMoneyBill, faMoneyBillTransfer, faReceipt } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { HistoryList } from '../../../components/HistoryList';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { SectionHeader } from '../../../components/elements/Section';
import { ICheckoutData } from '../../../components/payment/useWhipFundsCheckout';
import { IWhipEvent } from '../../../states/Whip/types';
import { toCurrencyPresentation } from '../../../utils/masks';

export const HistorySection = ({ history, userId }: any) => {

  const parsedHistoryData = React.useMemo(() => {
    if (!history) return [];

    // const foo = history.filter(
    //   (i: IWhipEvent) => i?.type === 'ACCOUNT'
    // ).map(m => ({ type: m?.type, subType: m?.subType }));
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    // console.log(JSON.stringify(foo, null, 2));
    // console.log('!!!!!!! Length', foo.length);

    return history.map((item: IWhipEvent) => {
      const data = item?.data || item?.metadata;

      let description = '';
      let title = '';
      let icon = null;

      let amount = (data?.amount || data?.checkout?.details?.whipWillReceive) || 0;

      if (item?.type === 'WHIP' && item?.subType === 'WHIP_RECEIVED_FUNDS_FROM_ACCOUNT') {
        const isActivationEvent = data?.checkout?.details?.currentSubscriptionFee > 0;
        const checkout = (data?.checkout as ICheckoutData);
        const details = checkout?.details;
        description = `${data?.checkout?.userDisplayName} added funds.`;
        title = 'Funds added';
        icon = faCreditCard;
        amount = isActivationEvent ? details?.differenceToPayByGateway + details?.differenceToPayByPersonalBalance : amount;
      }

      if (item?.type === 'ACCOUNT' && item?.subType === 'ACCOUNT_MOVED_FUNDS_TO_WHIP') {
        description = `You moved funds from your Personal Balance to a Whip.`;
        title = 'Funds moved to a Whip';
        icon = faCreditCard;
        amount = (data?.checkout as ICheckoutData)?.details?.howMuchIWantToUpload || amount;
      }

      if (item?.type === 'ACCOUNT' && item?.subType === 'ACCOUNT_RECEIVED_FUNDS') {
        description = `You added funds to your Personal Balance.`;
        title = 'Funds added';
        icon = faCreditCard;
        amount = (data?.checkout as ICheckoutData)?.details?.differenceToPayByGateway || amount;
      }

      if (item?.type === 'WHIP' && item?.subType === 'WHIP_ACTIVATED') {
        description = `Whip monthly fee charged in ${toCurrencyPresentation(data?.subscriptionMonthlyFee)}.`;
        title = 'Whip activated';
        icon = faChampagneGlasses;
        amount = data?.subscriptionMonthlyFee;
      }

      if (item?.type === 'FUNDS_ADDED_TO_WHIP_SUCCEEDED') {
        description = `${data?.userDisplayName} added funds.`;
        title = 'Funds added';
        icon = faCreditCard;
      }

      if (item?.type === 'FUNDS_ADDED_TO_ACCOUNT_SUCCEEDED') {
        description = 'You added funds to your Personal Balance.';
        title = 'Funds added';
        icon = faCreditCard;
      }

      if (item?.type === 'REFUND_TO_ACCOUNT_SUCCEEDED') {
        description = `A refund was made to ${data?.userDisplayName}.`;
        title = 'Refund completed';
        icon = faMoneyBill;
      }

      if (item?.type === 'REFUND_FROM_WHIP_SUCCEEDED') {
        description = `A refund was made to your Personal Balance.`;
        title = 'Refund completed';
        icon = faMoneyBill;
      }

      if (item?.type === 'CARD_TRANSACTION_SUCCEEDED') {
        description = data?.merchant ?
          `A transaction was made to ${data?.merchant?.name} at ${data?.merchant?.city} (${data?.merchant?.country}).` :
          'A transaction was made.';
        title = 'Transaction succeeded';
        icon = faReceipt;
      }

      if (item?.type === 'CARD_TRANSACTION_REFUNDED') {
        description = data?.merchant ?
          `A transaction made to ${data?.merchant?.name} at ${data?.merchant?.city} (${data?.merchant?.country}) was refunded.` :
          'A transaction was refunded.';
        title = 'Transaction refunded';
        icon = faFileInvoice;
      }

      if (item?.type === 'TRANSFER_ACCOUNT_TO_WHIP_SUCCEEDED') {
        description = item.subType === 'ACCOUNT_EVENT' ?
          'You moved funds from your Personal Balance to a Whip.' :
          `${data?.userDisplayName} moved funds from his Personal Balance to this Whip.`;
        title = item.subType === 'ACCOUNT_EVENT' ? 'Funds moved to a Whip' : 'Whip received a transfer';
        icon = faMoneyBillTransfer;
      }

      return {
        ...item,
        type: item.type,
        title,
        description,
        icon,
        data: {
          ...(data),
          transactionDetails: {
            ...(data || {}),
            amount,
          },
        },
      };
    });
  }, [history]);

  return (
    <>
      <LineSeparator />
      <SectionHeader title="History" />
      <HistoryList data={parsedHistoryData} />
    </>
  );
};
