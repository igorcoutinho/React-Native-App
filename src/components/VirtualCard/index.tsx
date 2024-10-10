import { faCheckCircle, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { Images } from '../../theme/images';
import { Gap } from '../../theme/sizes';
import { Section } from '../elements/Section';

export const VirtualCard = ({
  balance = 0,
  cardNumber,
  cardCvv,
  cardExpDate,
  isLoading,
}: {
  balance?: number;
  cardNumber?: string;
  cardCvv?: string;
  cardExpDate?: string;
  isLoading?: boolean;
}) => {
  const [isCopied, setCopied] = React.useState(false);

  const copyToClipboard = React.useCallback(() => {
    Clipboard.setString(cardNumber);
    setCopied(true);
  }, [cardNumber]);

  const addSpaceAfter4Numbers = (number: string) => {
    if (!number) return '';
    const string = number.replace(/\s/g, '');
    const joy = string.match(/.{1,4}/g);
    return joy.join(' ');
  };

  const addSlashAfter2Numbers = (expDate: string) => {
    if (!expDate) return '';
    const string = expDate.replace(/\s/g, '');
    const joy = string.match(/.{1,2}/g);
    return joy.join('/');
  };

  const isMasked = !cardCvv && !cardExpDate;

  return (
    <View
      style={{
        alignItems: 'center',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        overflow: 'hidden',
        transform: [{ scale: 0.95 }],
      }}
    >
      {balance ? (
        <Text
          style={{
            color: 'white',
            fontSize: 32,
            padding: 15,
            paddingBottom: 0,
            position: 'absolute',
            right: -2,
            top: -5,
            zIndex: 1,
          }}
        >
          £{balance}
        </Text>
      ) : null}
      <View
        style={{
          padding: 15,
          position: 'absolute',
          left: 0,
          bottom: 0,
          zIndex: 1,
          gap: 5,
        }}
      >
        {isMasked ? (
          <Section direction="row" gap={Gap.xSmall}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              •••• •••• •••• {addSpaceAfter4Numbers(cardNumber)}
            </Text>
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : null}
          </Section>
        ) : (
          <TouchableOpacity onPress={copyToClipboard}>
            <Section direction="row" gap={Gap.xSmall}>
              <Text style={{ color: 'white', fontSize: 16 }}>
                {addSpaceAfter4Numbers(cardNumber)}
              </Text>
              <FontAwesomeIcon
                icon={isCopied ? faCheckCircle : faCopy}
                color={isCopied ? Colors.success : Colors.white}
              />
            </Section>
          </TouchableOpacity>
        )}
        <Text style={{ color: 'white', fontSize: 14 }}>
          {addSlashAfter2Numbers(cardExpDate) || '••/••'}
        </Text>
        <Text style={{ color: 'white', fontSize: 14 }}>{cardCvv || '•••'}</Text>
      </View>
      <Image
        source={Images.virtualCard}
        style={{
          width: '100%',
          aspectRatio: 1.584,
          resizeMode: 'contain',
        }}
      />
    </View>
  );
};
