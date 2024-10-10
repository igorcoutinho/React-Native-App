import {
  faBullseye,
  faChevronRight,
  faReceipt,
  faUsers,
  faWallet
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BaseButton } from '../../components/BaseButton';
import { FloatingBottom } from '../../components/FloatingBottom';
import { Bold, Heading, Paragraph } from '../../components/Typography';
import { WhipItem } from '../../components/WhipItem';
import { Section } from '../../components/elements/Section';
import { IWhip } from '../../states/Whip/types';
import { Colors } from '../../theme/colors';
import { Size } from '../../theme/sizes';
import { toCurrencyPresentation } from '../../utils/masks';

const ApplePayLogo = require('../../assets/applePayLogo.svg').default;
const WhipappIconWhite = require('../../assets/whipappIconWhite.svg').default;

export const DescriptiveButton = ({
  description,
  icon,
  onPress,
  title,
  danger,
  success,
  attention,
  muted,
  external,
  disabled = false
}: {
  description?: string;
  icon: any;
  onPress?: () => void;
  title: string;
  danger?: boolean;
  success?: boolean;
  attention?: boolean;
  muted?: boolean;
  external?: boolean;
  disabled?: boolean;
}) => (
  <BaseButton onPress={onPress} variant="light" disabled={disabled}>
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        marginLeft: -16,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: danger
            ? Colors.dangerDark
            : muted
              ? Colors.mutedDark
              : success
                ? Colors.successDark
                : attention
                  ? Colors.attentionDark
                  : Colors.brandSecondaryDark,
          borderRadius: 100,
          justifyContent: 'center',
          width: 32,
          height: 32,
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          size={17}
          color={
            danger
              ? Colors.danger
              : muted
                ? Colors.light
                : success
                  ? Colors.success
                  : attention
                    ? Colors.attention
                    : Colors.brandSecondary
          }
        />
      </View>
      <View style={{ flex: 1 }}>
        <Paragraph
          color={danger ? Colors.danger : Colors.paragraph}
          style={{ marginBottom: -2 }}
        >
          <Bold>{title}</Bold>
        </Paragraph>
        {description ? (
          <Paragraph color={Colors.mutedDark} size="small">
            {description}
          </Paragraph>
        ) : null}
      </View>
      <FontAwesomeIcon
        icon={external ? faBullseye : faChevronRight}
        size={16}
        style={{ marginRight: -8 }}
        color={Colors.mutedDark}
      />
    </View>
  </BaseButton>
);

export const AddToWalletBanner = ({
  onPressToDismiss,
}: {
  onPressToDismiss?: () => void;
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          borderRadius: 12,
          backgroundColor: Colors.dark,
        }}
        onPress={() => navigation.navigate('InAppWalletOffer')}
      >
        <Section direction="row" space={Size.small}>
          <ApplePayLogo width={42} height={38} />
          <Paragraph
            color={Colors.white}
            size="small"
            style={{ flex: 1, alignSelf: 'center' }}
          >
            Add your Whipapp Card to{'\n'}
            <Bold>Apple Wallet!</Bold>
          </Paragraph>
        </Section>
        {/* <BaseButton
          flatten
          onPress={() => navigation.goBack()}
          rounded
          variant="transparent"
          style={{
            position: 'absolute',
            right: 4,
            top: 4,
          }}
        >
          <FontAwesomeIcon icon={faTimes} size={16} color={Colors.light} />
        </BaseButton> */}
      </TouchableOpacity>
    </>
  );
};

export const BalanceDisplay = ({
  balance,
  disabled,
  deposits,
  spent,
  onPress,
}: {
  balance: string;
  disabled?: boolean;
  deposits: string;
  spent: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.4}
      style={{
        alignItems: 'center',
        padding: Size.regular,
        paddingTop: 20,
        paddingBottom: 0,
        borderRadius: 12,
      }}
      disabled={true}
      onPress={onPress}
    >
      <View>
        <Heading
          color={Colors.brandSecondary}
          size="xSmall"
          style={{
            textTransform: 'uppercase',
            position: 'absolute',
            left: 0,
            top: -7,
          }}
        >
          Balance
        </Heading>
        <FontAwesomeIcon
          icon={faWallet}
          color={Colors.brandSecondary}
          style={{
            top: -7,
            position: 'absolute',
            right: 0,
          }}
        />
        <Section align='center' gap={0}>
          <Section direction='row'>
            <Paragraph
              color={Colors.brandSecondary}
              style={{
                fontSize: 22,
                marginTop: 29,
                marginRight: -5,
              }}
            >
              £
            </Paragraph>
            <Paragraph
              color={Colors.brandSecondaryDark}
              style={{ fontSize: 52 }}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              <Bold>{balance || '0.00'}</Bold>
            </Paragraph>
          </Section>
          <Paragraph
            color={Colors.mutedDark}
            size="xSmall"
            style={{ marginTop: -4 }}
          >
            <Bold>Net deposits: </Bold>{toCurrencyPresentation(deposits || '0')} / <Bold> Total spent: </Bold>{toCurrencyPresentation(spent || '0')}
          </Paragraph>
        </Section>
      </View>
    </TouchableOpacity>
  );
};

export const WhipItemWrapper = ({
  onPressCTA,
  whip,
}: {
  onPressCTA: () => void;
  whip: IWhip;
}) => {
  return (
    <Section>
      <WhipItem {...whip} />
      {!!whip?.card?.accountId ? (
        <BaseButton
          flatten
          onPress={onPressCTA}
          disabled={!onPressCTA}
          style={{
            position: 'absolute',
            right: 15,
            top: 15,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: 8,
              width: '100%',
            }}
          >
            <FontAwesomeIcon icon={faWallet} color={Colors.white} />
            <Paragraph color={Colors.white}>Add Funds</Paragraph>
          </View>
        </BaseButton>
      ) : null}
    </Section>
  );
};

export const OverviewFooter = ({
  currentTab,
  displayAddToWalletBanner,
  onMainButtonPress,
  onPressToDismissBanner,
  onTabPress,
}: {
  currentTab: 'History' | 'Friends';
  displayAddToWalletBanner: boolean;
  onMainButtonPress: () => void;
  onPressToDismissBanner: () => void;
  onTabPress: (tab: 'History' | 'Friends') => void;
}) => {
  return (
    <FloatingBottom>
      {/* {displayAddToWalletBanner ? (
        <>
          <AddToWalletBanner onPressToDismiss={onPressToDismissBanner} />
          <View style={{ height: Gap.small }} />
        </>
      ) : null} */}
      <Section direction="row">
        <BaseButton onPress={onMainButtonPress} grow>
          Whipapp Card
        </BaseButton>
        <BaseButton
          onPress={() => onTabPress('History')}
          variant="secondary"
          selected={currentTab === 'History'}
          style={{
            width: currentTab === 'History' ? 46 : 100,
          }}
        >
          {currentTab === 'History' ? (
            <FontAwesomeIcon icon={faReceipt} color={Colors.white} />
          ) : (
            <Paragraph color={Colors.white}>History</Paragraph>
          )}
        </BaseButton>
        <BaseButton
          onPress={() => onTabPress('Friends')}
          variant="secondary"
          selected={currentTab === 'Friends'}
          style={{
            width: currentTab === 'Friends' ? 46 : 100,
          }}
        >
          {currentTab === 'Friends' ? (
            <FontAwesomeIcon icon={faUsers} color={Colors.white} />
          ) : (
            <Paragraph color={Colors.white}>Friends</Paragraph>
          )}
        </BaseButton>
      </Section>
    </FloatingBottom>
  );
};
