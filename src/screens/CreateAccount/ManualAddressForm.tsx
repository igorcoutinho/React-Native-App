import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import * as yup from 'yup';
import { Section } from '../../components/elements/Section';
import { FormField } from '../../components/form/FormField';
import { FormWrapper } from '../../components/form/FormWrapper';
import { InputText } from '../../components/form/InputText';
import { Size } from '../../theme/sizes';
import {
  validateAddressLine1,
  validateCity,
  validateFlatNumber,
  validateHouseName,
  validateHouseNumber,
  validatePostalCode
} from '../../utils/yupValidators';

export interface IManualAddressFormData {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  flatNumber?: string | null;
  houseName?: string | null;
  houseNumber?: string | null;
  postalCode?: string;
}

const validationSchema = yup
  .object({
    addressLine1: validateAddressLine1,
    city: validateCity,
    flatNumber: validateFlatNumber,
    houseName: validateHouseName,
    houseNumber: validateHouseNumber,
    postalCode: validatePostalCode,
  })
  .required();

export const ManualAddressForm = ({
  initialValues,
  onConfirm,
  onCancel,
}: {
  initialValues?: IManualAddressFormData;
  onConfirm: (formData: IManualAddressFormData) => void;
  onCancel: () => void;
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IManualAddressFormData>({
    defaultValues: {
      addressLine1: initialValues?.addressLine1 || '',
      city: initialValues?.city || '',
      flatNumber: initialValues?.flatNumber || '',
      houseName: initialValues?.houseName || '',
      houseNumber: initialValues?.houseNumber || '',
      postalCode: initialValues?.postalCode || '',
    },
    resolver: yupResolver(validationSchema) as any,
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Section space={Size.xLarge}>
        <FormWrapper
          onSubmit={handleSubmit(onConfirm)}
          onCancel={onCancel}
          buttonLabel="Save"
        >
          <Section>
            <FormField
              control={control}
              name="flatNumber"
              title="Flat Number (Optional)"
              render={fieldProps => (
                <InputText
                  keyboardType="numbers-and-punctuation"
                  onBlur={fieldProps.onBlur}
                  onChange={value => fieldProps.onChange(value)}
                  placeholder="Flat Number"
                  value={fieldProps.value}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              )}
            />

            <FormField
              control={control}
              name="houseName"
              title="House Name"
              validationSchema={validateHouseName}
              render={fieldProps => (
                <InputText
                  onBlur={fieldProps.onBlur}
                  onChange={value => fieldProps.onChange(value)}
                  placeholder="House Name"
                  value={fieldProps.value}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              )}
            />

            <FormField
              control={control}
              name="houseNumber"
              title="House Number"
              validationSchema={validateHouseNumber}
              render={fieldProps => (
                <InputText
                  keyboardType="numbers-and-punctuation"
                  onBlur={fieldProps.onBlur}
                  onChange={value => fieldProps.onChange(value)}
                  placeholder="House Number"
                  value={fieldProps.value}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              )}
            />

            <FormField
              control={control}
              name="addressLine1"
              title="Address Line 1"
              validationSchema={validateAddressLine1}
              render={fieldProps => (
                <InputText
                  autoComplete="address-line1"
                  onBlur={fieldProps.onBlur}
                  onChange={value => fieldProps.onChange(value)}
                  placeholder="Address Line 1..."
                  value={fieldProps.value}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              )}
            />

            <FormField
              control={control}
              name="addressLine2"
              title="Address Line 2 (Optional)"
              render={fieldProps => (
                <InputText
                  autoComplete="address-line2"
                  onBlur={fieldProps.onBlur}
                  onChange={value => fieldProps.onChange(value)}
                  placeholder="Address Line 2..."
                  value={fieldProps.value}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              )}
            />

            <FormField
              control={control}
              name="city"
              title="City"
              validationSchema={validateCity}
              render={fieldProps => (
                <InputText
                  autoComplete="postal-address-locality"
                  onBlur={fieldProps.onBlur}
                  onChange={value => fieldProps.onChange(value)}
                  placeholder="Some City"
                  value={fieldProps.value}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              )}
            />

            <FormField
              control={control}
              name="postalCode"
              title="Postal Code"
              validationSchema={validatePostalCode}
              render={fieldProps => (
                <InputText
                  autoComplete="postal-code"
                  onBlur={fieldProps.onBlur}
                  onChange={value => fieldProps.onChange(value)}
                  placeholder="XXXX XXX"
                  value={fieldProps?.value?.toUpperCase()}
                />
              )}
            />
          </Section>
        </FormWrapper>
      </Section>
    </TouchableWithoutFeedback>
  );
};
