import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { format } from 'date-fns';
import React from 'react';
import { View } from 'react-native';
import { Bold, Paragraph } from '../../components/Typography';
import { IWhipEvent } from '../../states/Whip/types';
import { Colors } from '../../theme/colors';
import { toCurrency } from '../../utils/masks';

export const HistoryItem = ({ data }: { data: IWhipEvent }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        gap: 10,
        borderRadius: 12,
      }}
    >
      <View
        style={{
          alignItems: 'flex-end',
          flexDirection: 'row',
          flex: 1,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: Colors.greyLight,
              borderRadius: 100,
              height: 40,
              justifyContent: 'center',
              marginRight: 10,
              width: 40,
            }}
          >
            <FontAwesomeIcon icon={data.icon || faMoneyBill} color={Colors.mutedDark} />
          </View>
          <View style={{ gap: 2, flex: 1 }}>
            <Paragraph
              color={Colors.mutedDark}
              size="small"
              style={{ textTransform: 'capitalize' }}
            >
              <Bold>{data?.title || data.type.replace('_', ' ')}</Bold>
            </Paragraph>
            <Paragraph size="xSmall" ellipsizeMode="tail" numberOfLines={2}>
              {data.description}
            </Paragraph>
            <Paragraph color={Colors.mutedDark} size="xSmall">
              {data?.createdAt?.seconds
                ? format(data?.createdAt?.seconds * 1000, 'MMM dd, yyyy hh:mm a')
                : ''}
            </Paragraph>
          </View>
        </View>
      </View>

      {data.data?.transactionDetails?.amount ? (
        <Paragraph color={Colors.brandDark} size="small">
          {toCurrency(
            data.data?.transactionDetails?.amount,
            data.data?.transactionDetails?.currency,
          )}
        </Paragraph>
      ) : null}

    </View>
  );
};
