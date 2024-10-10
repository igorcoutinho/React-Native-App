import React from 'react';
import { Appearance } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { IInputTextProps, InputText } from './InputText';

interface IInputSelectProps extends IInputTextProps {
  onChange: (value: string) => void;
  optionPlaceholder?: { label: string; value: string };
  options: { label: string; value: string }[];
  value: string;
}

export const InputSelect = ({
  onChange,
  optionPlaceholder,
  options,
  value,
  ...rest
}: IInputSelectProps) => {
  const [inputFocus, setInputFocus] = React.useState(false);

  return (
    <RNPickerSelect
      darkTheme={Appearance.getColorScheme() === 'dark'}
      useNativeAndroidPickerStyle={false}
      value={value}
      onValueChange={onChange}
      placeholder={
        optionPlaceholder || { label: 'Select an option', value: '' }
      }
      onOpen={() => {
        setInputFocus(true);
      }}
      onClose={() => {
        setInputFocus(false);
      }}
      items={options}
    >
      <InputText
        {...rest}
        editable={false}
        focused={inputFocus}
        value={(options || []).find(item => item.value === value)?.label || ''}
      />
    </RNPickerSelect>
  );
};
