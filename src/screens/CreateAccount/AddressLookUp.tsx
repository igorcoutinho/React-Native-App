import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import axios from 'axios';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { AutocompleteDropdown, AutocompleteDropdownItem, IAutocompleteDropdownRef } from 'react-native-autocomplete-dropdown';
import { storage } from '../..';
import { BaseButton } from '../../components/BaseButton';
import { DialogV2 } from '../../components/DialogV2';
import { Section } from '../../components/elements/Section';
import { InputText } from '../../components/form/InputText';
import { Paragraph } from '../../components/Typography';
import { setAPIUrl } from '../../constants';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import { ManualAddressForm } from './ManualAddressForm';

export interface IAddressLookUpParts {
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  addressLookupRef?: string;
  addressSummary?: string;
  buildingName?: string;
  buildingNumber?: string;
  countryCode?: string;
  organisationName?: string;
  postcode?: string;
  postTown?: string;
  subBuildingName?: string;
  thoroughfare?: string;
}

export interface IAddressLookUpItem extends AutocompleteDropdownItem, IAddressLookUpParts { }

const MAX_ADDRESS_LOOKUP_ATTEMPTS = 4;

export const AddressLookUp = memo(({
  defaultInputValue,
  defaultValues,
  values,
  onChange
}: {
  defaultInputValue?: string;
  defaultValues?: any;
  values?: any;
  onChange: (value: IAddressLookUpParts) => void
}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [inputValue, setInputValue] = useState(defaultInputValue);

  const dropdownController = useRef<IAutocompleteDropdownRef>(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (defaultInputValue) {
      dropdownController?.current?.setInputText(defaultInputValue);
      setInputValue(defaultInputValue);
      setSuggestionsList(defaultInputValue ? [{ id: 0, title: defaultInputValue }] as unknown as AutocompleteDropdownItem[] : null);
      setSelectedItem(defaultInputValue ? { id: 0, title: defaultInputValue } as unknown as AutocompleteDropdownItem : null);
    }
  }, [defaultInputValue]);

  const getSuggestions = useCallback(async (q: string) => {
    if (typeof q !== 'string' || q.length < 7) {
      setSuggestionsList(null);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${setAPIUrl('lookupAddress')}`, { postCode: q });
      const items = response.data as IAddressLookUpItem[];
      const suggestions = items.map(item => ({ id: item.addressLookupRef, title: buildAddressString(item), ...item }));
      setSuggestionsList(suggestions);
      setLoading(false);
    } catch (error) {
      setSuggestionsList([]);
      setLoading(false);
    }
  }, []);

  const onClearPress = useCallback(() => {
    setInputValue('');
    setSuggestionsList(null);
    setSelectedItem(null);
  }, []);

  const addressLookupAttempts = Number(storage.getString('addressLookupAttempts') || 0);

  console.log(addressLookupAttempts);

  return (
    <>
      <Section>
        {addressLookupAttempts >= MAX_ADDRESS_LOOKUP_ATTEMPTS ? (
          <InputText
            editable={false}
            value={inputValue}
          />
        ) : (
          <View style={[{ flex: 1, height: 42, flexDirection: 'row', alignItems: 'center' }, Platform.select({ ios: { zIndex: 1 } })]}>
            <AutocompleteDropdown
              ref={searchRef}
              controller={controller => dropdownController.current = controller}
              direction={Platform.select({ ios: 'down' })}
              dataSet={suggestionsList}
              onSelectItem={item => {
                dropdownController?.current?.setInputText(item?.title || '');
                setInputValue(item?.title || '');
                setSelectedItem(item);
                onChange(item as IAddressLookUpItem);
              }}
              ClearIconComponent={<FontAwesomeIcon color={Colors.mutedDark} icon={faTimes} />}
              debounce={0}
              suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
              onClear={onClearPress}
              loading={loading}
              useFilter={false}
              renderItem={item => {
                const isSelected = selectedItem?.title === item.title;
                return (
                  <View style={{ padding: 15 }}>
                    <Paragraph style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                      {item.title}
                    </Paragraph>
                  </View>
                );
              }}
              editable={selectedItem === null || !loading}
              textInputProps={{
                placeholder: selectedItem?.title || 'Enter your postcode',
                autoCorrect: false,
                autoCapitalize: 'none',
                onChangeText: (value) => {
                  let input = value.replace(/\s+/g, '').toUpperCase();
                  if (input.length > 8) {
                    input = input.slice(0, 8);
                  }
                  if (input.length === 6) {
                    input = input.slice(0, 3) + ' ' + input.slice(3);
                  } else if (input.length >= 7) {
                    input = input.slice(0, 4) + ' ' + input.slice(4);
                  }
                  dropdownController?.current?.setInputText(input);
                  setInputValue(input);
                },
                value: inputValue,
                style: {
                  color: Colors.paragraph,
                  flex: 1,
                  fontSize: FontSize.regular,
                  height: 38,
                  paddingHorizontal: 10,
                },
              }}
              rightButtonsContainerStyle={{
                height: 30,
                alignSelf: 'center',
              }}
              inputContainerStyle={{
                alignItems: 'center',
                backgroundColor: '#f2f2f2',
                borderColor: 'transparent',
                borderRadius: 12,
                borderWidth: 2,
                flexDirection: 'row',
                overflow: 'hidden',
              }}
              containerStyle={{ flexGrow: 1, flexShrink: 1 }}
              showChevron={false}
              closeOnBlur={true}
            />
          </View>
        )}
        <Section style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
          <BaseButton
            flatten
            onPress={async () => {
              if (addressLookupAttempts >= 4) {
                setVisible(true);
                return;
              }
              if (suggestionsList?.length > 0) {
                dropdownController?.current?.open();
                return;
              }
              await getSuggestions(inputValue);
              await storage.set('addressLookupAttempts', String(addressLookupAttempts + 1));
              dropdownController?.current?.open();
            }}
          >
            {addressLookupAttempts >= MAX_ADDRESS_LOOKUP_ATTEMPTS ? 'Edit Address Manually' : 'Address Look Up'}
          </BaseButton>
        </Section>
      </Section>
      <DialogV2 autoHeight visible={visible} onRequestClose={() => setVisible(false)}>
        <ManualAddressForm
          initialValues={values}
          onCancel={() => setVisible(false)}
          onConfirm={(values) => {
            onChange(transformAddressToAddressLookUpItem(values));
            const defaultInputValue = buildAddressString(transformAddressToAddressLookUpItem(values));
            dropdownController?.current?.setInputText(defaultInputValue);
            setInputValue(defaultInputValue);
            setSuggestionsList(defaultInputValue ? [{ id: 0, title: defaultInputValue }] as unknown as AutocompleteDropdownItem[] : null);
            setSelectedItem(defaultInputValue ? { id: 0, title: defaultInputValue } as unknown as AutocompleteDropdownItem : null);
            setVisible(false);
          }}
        />
      </DialogV2>
    </>
  )
});

interface AddressParts {
  organisationName?: string;
  subBuildingName?: string;
  buildingName?: string;
  buildingNumber?: string;
  thoroughfare?: string;
  postTown?: string;
  postcode?: string;
}

export function transformAddressToAddressLookUpItem(parts: {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  flatNumber?: string | null;
  houseName?: string | null;
  houseNumber?: string | null;
  postalCode?: string;
}): IAddressLookUpParts {
  return {
    subBuildingName: parts?.flatNumber || '',
    buildingName: parts?.houseName || '',
    buildingNumber: parts?.houseNumber || '',
    thoroughfare: parts?.addressLine1 || '',
    postTown: parts?.city || '',
    postcode: parts?.postalCode || '',
  };
}

export function buildAddressString(components: AddressParts): string {
  const parts = [
    components?.organisationName,
    components?.subBuildingName,
    components?.buildingName,
    (components?.buildingNumber && components?.thoroughfare) ? `${components?.buildingNumber} ${components?.thoroughfare}` :
      components?.buildingNumber ? components?.buildingNumber :
        components?.thoroughfare ? components?.thoroughfare : null,
    components?.postTown,
    components?.postcode
  ].filter(part => part !== null && part !== undefined && part.length > 0);
  return parts.join(', ');
}
