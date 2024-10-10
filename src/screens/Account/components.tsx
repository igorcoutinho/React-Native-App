import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../components/BaseButton';
import { Bold, Heading, Paragraph } from '../../components/Typography';
import { LineSeparator } from '../../components/elements/LineSeparator';
import { Section } from '../../components/elements/Section';
import { useUser } from '../../states/User';
import { Colors } from '../../theme/colors';
import { Size } from '../../theme/sizes';
import { toNumericFormat } from '../../utils/masks';

export const Balance = ({
  balance,
  label,
  hideButton = false,
  onPressHelp,
}: {
  balance?: string;
  label?: string;
  hideButton?: boolean;
  onPressHelp?: () => void;
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useUser();

  const balanceValue = toNumericFormat(user?.account?.balance || 0) || '0.00';

  return (
    <>
      <View
        style={{
          alignItems: 'center',
          padding: Size.regular,
          paddingTop: 5,
          paddingBottom: 0,
          borderRadius: 12,
        }}
      >
        <Heading
          color={Colors.brandSecondary}
          size="xSmall"
          align="center"
          style={{ textTransform: 'uppercase' }}
        >
          {label || 'My personal Balance'}
        </Heading>
        <View
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            marginTop: -5,
          }}
        >
          <Paragraph
            color={Colors.brandSecondaryDark}
            style={{ fontSize: 52 }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            <Bold>{balanceValue}</Bold>
          </Paragraph>
          <Paragraph
            color={Colors.brandSecondary}
            style={{
              fontSize: 22,
              position: 'absolute',
              left: -20,
              bottom: 5,
            }}
          >
            £
          </Paragraph>
        </View>
      </View>
      {!hideButton ? (
        <>
          <LineSeparator />
          <Section direction="row">
            {/* <BaseButton
          flatten
          grow
          onPress={() => navigation.navigate('ManageBalance')}
        >
          Manage Balance
        </BaseButton> */}
            <BaseButton
              flatten
              grow
              variant="secondary"
              onPress={() => navigation.navigate('AccountAddFunds')}
            >
              Add Funds
            </BaseButton>
            <BaseButton flatten variant="muted" onPress={onPressHelp}>
              Help
            </BaseButton>
          </Section>
        </>
      ) : null}
    </>
  );
};
