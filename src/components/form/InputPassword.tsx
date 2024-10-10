import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Input, InputField, InputSlot } from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { FieldPath, FieldValues, useController } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { Colors } from '../../theme/colors';
import { IInputTextProps } from './InputText';

export const InputPassword = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  autoComplete,
  control,
  defaultValue,
  isDisabled,
  isInvalid,
  name,
  placeholder,
}: IInputTextProps<TFieldValues, TName> &
  TextInputProps & {
    isDisabled?: boolean;
    isInvalid?: boolean;
  }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { field } = useController({
    control,
    defaultValue,
    name,
  });

  return (
    <Input
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      style={{
        backgroundColor: 'white',
      }}
    >
      <InputSlot pl="$3">
        <FontAwesomeIcon icon={faLock} color="orange" />
      </InputSlot>
      <InputField
        autoComplete={autoComplete || 'current-password'}
        type={showPassword ? 'text' : 'password'}
        value={field.value}
        onChangeText={field.onChange}
        placeholder={placeholder}
        style={{
          paddingBottom: 5,
        }}
      />
      <InputSlot
        pr="$3"
        onPress={() => setShowPassword(showState => !showState)}
      >
        <FontAwesomeIcon
          icon={showPassword ? faEye : faEyeSlash}
          color={Colors.brandSecondary}
        />
      </InputSlot>
    </Input>
  );
};
