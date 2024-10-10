import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AsYouType, CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import React, { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Platform, TextInput, View } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownItem, IAutocompleteDropdownRef } from 'react-native-autocomplete-dropdown';
import { Paragraph } from '../../components/Typography';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import { countriesData, ICountryDataItem } from '../../utils/countries';
import { BaseButton } from '../BaseButton';
import { Section } from '../elements/Section';

export interface ICountryDropdownItem extends AutocompleteDropdownItem, ICountryDataItem { }

export const PhoneNumberField = memo(forwardRef(({
  defaultValue,
  onChange,
  disabled,
  onFocus,
  onBlur,
  onSubmitEditing,
  value,
}: {
  defaultValue?: string;
  onChange: (data: {
    isValid: boolean;
    value: string;
    template: string;
    nationalNumber: string;
  }) => void;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  value?: string;
}, ref: React.Ref<any>) => {
  const [selectedItem, setSelectedItem] = useState<ICountryDropdownItem>(countriesData[0] as ICountryDropdownItem);

  const [focus, setFocus] = React.useState(false);
  const [inputValue, setInputValue] = useState('');

  const dropdownController = useRef<IAutocompleteDropdownRef>(null);

  useEffect(() => {
    if (defaultValue && defaultValue?.length > 4) {
      const parseDefaultValue = parsePhoneNumber(defaultValue);
      setInputValue(parseDefaultValue.nationalNumber);
      setSelectedItem(countriesData.find(item => item.internationalCode === '+' + parseDefaultValue.countryCallingCode) as ICountryDropdownItem);
    }
  }, [defaultValue]);

  const renderFlag = useCallback(() => {
    if (!selectedItem) {
      return null;
    }
    const country = countriesData.find(item => item.countryCode === selectedItem.countryCode);
    if (!country) {
      return null;
    }
    return (
      <Image
        source={{ uri: country.flag }}
        style={{
          height: 22,
          width: 22,
          borderRadius: 100,
          marginLeft: 10,
          borderWidth: 1,
          borderColor: Colors.muted,
        }}
      />
    );
  }, [selectedItem]);

  const handleChangeInput = useCallback((text: string, countryCode: CountryCode) => {
    const asYouType = new AsYouType(countryCode);
    const value = asYouType.input(text);
    onChange?.({
      isValid: asYouType.isValid(),
      value: asYouType.getNumberValue(),
      template: asYouType.getTemplate(),
      nationalNumber: asYouType.getNationalNumber(),
    });
    setInputValue(value);
  }, []);

  return (
    <Section
      direction="row"
      style={{
        justifyContent: 'center',
        gap: 0,
        backgroundColor: '#f2f2f2',
        borderColor: 'transparent',
        borderRadius: 12,
        borderWidth: 2,
        height: 38,
      }}
    >
      <View
        style={[{
          flexDirection: 'row',
          alignItems: 'center',
        }, Platform.select({
          ios: { zIndex: 1 }
        })]}
      >
        <AutocompleteDropdown
          direction={Platform.select({ ios: 'down' })}
          dataSet={countriesData.map(item => ({ id: item.countryCode, title: item.internationalCode, ...item }))}
          controller={controller => dropdownController.current = controller}
          onSelectItem={item => {
            setSelectedItem(item as ICountryDropdownItem);
            const isEqual = (item as ICountryDropdownItem)?.countryCode === selectedItem?.countryCode;
            handleChangeInput(isEqual ? inputValue : '', (item as ICountryDropdownItem)?.countryCode);
          }}
          initialValue={selectedItem?.countryCode}
          suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
          useFilter={false}
          ClearIconComponent={<></>}
          RightIconComponent={<></>}
          rightButtonsContainerStyle={{ width: 0 }}
          LeftComponent={renderFlag()}
          renderItem={item => {
            const isSelected = selectedItem?.title === item.title;
            return (
              <Section direction="row" style={{
                alignItems: 'center',
                paddingVertical: 10,

              }}>
                <Image
                  source={{ uri: (item as ICountryDropdownItem)?.flag }}
                  style={{
                    height: 22,
                    width: 22,
                    borderRadius: 100,
                    marginLeft: 10,
                    borderWidth: 1,
                    borderColor: Colors.muted,
                  }}
                />
                <Paragraph style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                  {item.title}
                </Paragraph>
              </Section>
            );
          }}
          editable={false}
          textInputProps={{
            style: {
              color: Colors.paragraph,
              fontSize: FontSize.regular,
              paddingHorizontal: 10,
              fontWeight: 'bold',
            },
          }}
          inputContainerStyle={{
            alignItems: 'center',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            flexDirection: 'row',
            overflow: 'hidden',
            width: 81,
            height: 34,
            borderRadius: 0,
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          showChevron={false}
          closeOnBlur={true}
        />
      </View>
      <TextInput
        ref={ref}
        focusable={true}
        editable={!disabled}
        placeholder="Enter your phone number"
        onFocus={() => {
          setFocus(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocus(false);
          onBlur?.();
        }}
        onChangeText={(text) => handleChangeInput(text, (selectedItem as ICountryDropdownItem)?.countryCode)}
        placeholderTextColor={Colors.muted}
        style={{
          color: Colors.paragraph,
          backgroundColor: 'transparent',
          flex: 1,
          fontSize: FontSize.regular,
          height: 24,
          paddingHorizontal: 10,
          borderLeftWidth: 1,
          borderLeftColor: Colors.muted,
          marginTop: 5,
          paddingRight: 10,
        }}
        value={inputValue}
        onSubmitEditing={onSubmitEditing}
      />
      {inputValue.length > 0 && (
        <BaseButton
          flatten
          variant="transparent"
          onPress={() => handleChangeInput('', (selectedItem as ICountryDropdownItem)?.countryCode)}
          style={{
            marginTop: 3,
            marginRight: -5,
          }}
        >
          <FontAwesomeIcon color={Colors.mutedDark} icon={faTimes} />
        </BaseButton>
      )}
    </Section>
  )
}));
