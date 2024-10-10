
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { differenceInSeconds, format, toDate } from 'date-fns';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Bold, Heading, Paragraph } from '../../components/Typography';
import { Colors } from '../../theme/colors';
const ApplePayLogo = require('../../../assets/applePayLogo.svg').default;
const Contactless = require('../../../assets/contactless.svg').default;

export const TicketInformation = ({ data, isLoading }: {
  data: any;
  isLoading?: boolean;
}) => {
  const createdAt = data
    ? format(data?.createdAt?.seconds * 1000, 'MMM do, yyyy hh:mm a')
    : '';

  const diff = differenceInSeconds(new Date(), toDate(data?.createdAt?.seconds * 1000));

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.mutedDark}
              style={{
                transform: [{ scale: 2.4 }],
              }}
            />
          ) : (
            <FontAwesomeIcon
              color={Colors.attention}
              icon={faShieldAlt}
              size={100}
            />
          )}
        </View>
        <View>
          <Heading align="center" size="large">
            3DS Secure Authentication
          </Heading>
          {data ? (
            <>
              <Paragraph align="center" size="large">
                Confirm this transaction if <Bold>you</Bold> are using your Whipapp Card at
              </Paragraph>
              <Paragraph align="center" size="large">
                <Bold>{createdAt}</Bold>
              </Paragraph>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
};
