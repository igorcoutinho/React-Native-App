import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { View } from 'react-native';
import { Bold, Heading, Paragraph } from '../../../components/Typography';
import { Colors } from '../../../theme/colors';
const ApplePayLogo = require('../../../assets/applePayLogo.svg').default;
const Contactless = require('../../../assets/contactless.svg').default;

export const SuccessScreen = () => {
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
        <FontAwesomeIcon
          color={Colors.success}
          icon={faCheckCircle}
          size={76}
        />
        <View>
          <Heading align="center" size="large">
            Your card has been added
          </Heading>
          <Heading align="center" size="xLarge">
            to Apple Wallet
          </Heading>
        </View>
        <Paragraph
          color={Colors.mutedDark}
          align="center"
          size="small"
          style={{ maxWidth: 300 }}
        >
          <Bold>Apple Pay</Bold> is an easier way to pay in shops,{'\n'}in apps,
          and online with your iPhone,{'\n'}Apple Watch, iPad and Mac.
        </Paragraph>
      </View>

      <Paragraph
        color={Colors.mutedDark}
        align="center"
        style={{ marginBottom: 10 }}
        size="xSmall"
      >
        Use Apple Pay wherever you see one of these symbols:
      </Paragraph>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <Contactless width={39} height={38} />
        <ApplePayLogo width={42} height={37} />
      </View>
    </View>
  );
};
