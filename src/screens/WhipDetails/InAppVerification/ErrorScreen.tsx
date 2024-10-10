import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { View } from 'react-native';
import { Heading, Paragraph } from '../../../components/Typography';
import { Colors } from '../../../theme/colors';

export const ErrorScreen = () => {
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
        <FontAwesomeIcon color={Colors.danger} icon={faXmarkCircle} size={76} />
        <View>
          <Heading align="center" size="large">
            An error occurred
          </Heading>
        </View>
        <Paragraph
          color={Colors.mutedDark}
          align="center"
          size="small"
          style={{ maxWidth: 300 }}
        >
          Please try again or contact support{'\n'}if the problem persists.
        </Paragraph>
      </View>
    </View>
  );
};
