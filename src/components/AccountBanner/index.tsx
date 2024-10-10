import {
  faCheck,
  faCog,
  faExclamation,
  faShield,
  faSpinner,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Bold, Heading, Paragraph } from '../../components/Typography';
import { Box, Section } from '../../components/elements/Section';
import { Colors } from '../../theme/colors';
import { styles } from './styles';

const WhipappIconWhite = require('../../assets/whipappIconWhite.svg').default;

export const AccountBanner = ({
  name,
  onPress,
  since,
  status,
}: {
  name?: string;
  onPress?: () => void;
  since?: string;
  status?: 'verified' | 'unverified' | 'processing' | 'inconclusive';
}) => {
  let color;
  let icon;

  switch (status) {
    case 'verified':
      color = Colors.success;
      icon = faCheck;
      break;
    case 'unverified':
      color = Colors.danger;
      icon = faXmark;
      break;
    case 'processing':
      color = Colors.brandSecondary;
      icon = faSpinner;
      break;
    case 'inconclusive':
      color = Colors.attention;
      icon = faExclamation;
      break;
    default:
      color = Colors.brandSecondary;
      icon = null;
      break;
  }

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <Box>
        <Section direction="row">
          <Section grow gap={0}>
            <Heading
              color={Colors.brandSecondaryDark}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {name}
            </Heading>
            {since ? (
              <Paragraph color={Colors.mutedDark} size="xSmall">
                Account since: {since}
              </Paragraph>
            ) : null}
            <Paragraph color={Colors.dark} size="xSmall">
              Status:{' '}
              <Bold color={color}>
                {String(status || 'WAITING').toUpperCase()}
              </Bold>
            </Paragraph>
          </Section>
          <AccountBadge color={color} icon={icon} />
        </Section>
        {onPress ? (
          <View style={styles.manageAccountIcon}>
            <FontAwesomeIcon icon={faCog} size={12} color={Colors.white} />
          </View>
        ) : null}
      </Box>
    </TouchableOpacity>
  );
};

export const AccountBadge = ({
  color,
  icon,
  style,
}: {
  color: Colors;
  icon?: any;
  style?: any;
}) => {
  return (
    <View
      style={{
        ...styles.badgeContainer,
        borderColor: color,
        ...style,
      }}
    >
      {icon && icon !== 'spinner' ? (
        <View style={{ ...styles.badgeIconContainer, backgroundColor: color }}>
          <FontAwesomeIcon icon={icon} size={10} color={Colors.white} />
        </View>
      ) : null}
      {icon && icon === 'spinner' ? (
        <View
          style={{
            ...styles.badgeIconContainer,
            backgroundColor: color,
          }}
        >
          <ActivityIndicator
            size="small"
            color={Colors.white}
            style={{
              transform: [{ scale: 0.5 }],
            }}
          />
        </View>
      ) : null}
      <FontAwesomeIcon
        icon={faShield}
        size={29}
        color={Colors.brandSecondaryDark}
        style={{ position: 'absolute' }}
      />
      <WhipappIconWhite height={16} width={16} />
    </View>
  );
};
