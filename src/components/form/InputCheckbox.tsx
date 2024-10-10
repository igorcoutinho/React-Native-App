import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@gluestack-ui/themed';
import { CheckIcon } from 'lucide-react-native';
import React from 'react';
import { FieldPath, FieldValues, useController } from 'react-hook-form';

export const InputCheckbox = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  defaultValue,
  isDisabled,
  isInvalid,
  label,
  name,
}: any & {
  isDisabled?: boolean;
  isInvalid?: boolean;
  label?: string;
}) => {
  const { field } = useController({
    control,
    defaultValue,
    name,
  });

  return (
    <Checkbox
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      onChange={field.onChange}
      defaultIsChecked={field.value}
      size="md"
      value={field.value}
      aria-label={'label'}
      alignItems="flex-start"
    >
      <CheckboxIndicator mr="$2" borderColor="orange">
        <CheckboxIcon as={CheckIcon} color="white" backgroundColor="orange" />
      </CheckboxIndicator>
      <CheckboxLabel style={{ marginTop: -1, flex: 1 }}>
        {label}
      </CheckboxLabel>
    </Checkbox>
  );
};
