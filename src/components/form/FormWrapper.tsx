import React from 'react';
import { GestureResponderEvent, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseButton } from '../../components/BaseButton';
import { Colors } from '../../theme/colors';
import { ScrollableContainer } from '../MainContainer';
import { Bold, Paragraph } from '../Typography';
import { Section } from '../elements/Section';

interface IProps {
  buttonLabel?: string;
  children: React.ReactElement;
  onSubmit: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  cancelLabel?: string;
  onCancel?: (event: GestureResponderEvent) => void;
}

export function FormWrapper({
  buttonLabel,
  cancelLabel,
  onCancel,
  children,
  onSubmit,
  disabled = false,
}: IProps) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <ScrollableContainer>{children}</ScrollableContainer>
      <View
        style={{
          backgroundColor: Colors.white,
          paddingBottom: insets.bottom,
          paddingTop: 20,
          width: '100%',
        }}
      >
        <Section direction='row'>
          <BaseButton onPress={onSubmit}
            disabled={disabled}
            grow
          >
            <Paragraph color={Colors.white}>
              <Bold>{buttonLabel || 'Submit'}</Bold>
            </Paragraph>
          </BaseButton>
          {onCancel ? (
            <BaseButton onPress={onCancel}
              disabled={disabled}
              variant="muted"
            >
              <Paragraph color={Colors.white}>
                <Bold>{cancelLabel || 'Cancel'}</Bold>
              </Paragraph>
            </BaseButton>
          ) : null}
        </Section>
      </View>
    </>
  );
}
