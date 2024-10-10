import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Heading, Paragraph } from '../../../components/Typography';
import { Colors } from '../../../theme/colors';
const ApplePayLogo = require('../../../assets/applePayLogo.svg').default;
const Contactless = require('../../../assets/contactless.svg').default;

export const VerifyingScreen = () => {
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
        <ActivityIndicator
          size="large"
          color={Colors.attention}
          style={{
            transform: [{ scale: 1.8 }],
            marginBottom: 20,
          }}
        />
        <View>
          <Heading align="center" size="large">
            Verifying Card
          </Heading>
        </View>
        <Paragraph
          color={Colors.mutedDark}
          align="center"
          size="small"
          style={{ maxWidth: 300 }}
        >
          Wait a little while we verify your card.
        </Paragraph>
      </View>
    </View>
  );
};
