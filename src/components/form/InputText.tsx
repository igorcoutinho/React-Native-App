import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';

export interface IInputTextProps extends Omit<TextInputProps, 'onChange'> {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  disabled?: boolean;
  focused?: boolean;
  onBlur?: () => void;
  onChange?: (text: string) => void;
  onFocus?: () => void;

  leftIcon?: IconProp;
  leftAccessory?: React.ReactNode;
  rightIcon?: IconProp;
  rightAccessory?: React.ReactNode;
}

export const InputText = React.forwardRef(
  (
    {
      autoCapitalize = 'none',
      disabled,
      focused,
      onChange,
      onBlur,
      onFocus,

      leftIcon,
      leftAccessory,
      rightIcon,
      rightAccessory,
      value = '',

      ...rest
    }: IInputTextProps,
    ref: React.Ref<any>,
  ) => {
    const [focus, setFocus] = React.useState(false);
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#f2f2f2',
          borderColor: focus || focused ? Colors.brandSecondary : 'transparent',
          borderRadius: 12,
          borderWidth: 2,
          flexDirection: 'row',
          gap: 10,
          overflow: 'hidden',
          paddingHorizontal: 10,
        }}
      >
        {leftIcon ? (
          <View>
            <FontAwesomeIcon icon={leftIcon} color="orange" />
          </View>
        ) : null}
        {leftAccessory ? leftAccessory : null}
        <TextInput
          ref={ref}
          autoCapitalize={autoCapitalize}
          focusable={true}
          editable={!disabled}
          onFocus={() => {
            setFocus(true);
            onFocus?.();
          }}
          onBlur={() => {
            setFocus(false);
            onBlur?.();
          }}
          onChangeText={onChange}
          placeholderTextColor={Colors.muted}
          style={{
            color: Colors.paragraph,
            flex: 1,
            fontSize: FontSize.regular,
            height: 38,
            paddingHorizontal: 0,
            paddingVertical: 0,
          }}
          value={String(value)}
          {...rest}
        />
        {rightIcon ? (
          <View style={{ position: 'absolute' }}>
            <FontAwesomeIcon icon={rightIcon} color="orange" />
          </View>
        ) : null}
        {rightAccessory ? rightAccessory : null}
      </View>
    );
  },
);
