import { yupResolver } from '@hookform/resolvers/yup';
import { add } from 'date-fns';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import * as yup from 'yup';
import { BaseButtonInline } from '../../components/BaseButton';
import { Heading, Paragraph } from '../../components/Typography';
import { LineSeparator } from '../../components/elements/LineSeparator';
import { Section } from '../../components/elements/Section';
import { DatePicker } from '../../components/form/DatePicker';
import { FormField } from '../../components/form/FormField';
import { FormFieldInlineError } from '../../components/form/FormFieldInlineError';
import { FormWrapper } from '../../components/form/FormWrapper';
import { InputCheckbox } from '../../components/form/InputCheckbox';
import { InputSelect } from '../../components/form/InputSelect';
import { InputText } from '../../components/form/InputText';
import { PhoneNumberField } from '../../components/form/PhoneNumberField';
import {
  validateAddressLine1,
  validateAgreedToTerms,
  validateCity,
  validateDob,
  validateEmail,
  validateFirstName,
  validateFlatNumber,
  validateHouseName,
  validateHouseNumber,
  validateLastName,
  validatePhoneNumberV2UsingIsValidPhoneNumber,
  validatePostalCode,
  validateSourceOfFunds
} from '../../utils/yupValidators';
import { AddressLookUp, buildAddressString } from './AddressLookUp';
import { TPLTermsAndConditions } from './TPLTermsAndConditions';
import { WhipAppTermsAndConditions } from './WhipAppTermsAndConditions';

const CreateAccount = require('../../assets/createAccount.svg').default;

export interface IRegistrationFormData {
  address: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    flatNumber?: string | null;
    houseName?: string | null;
    houseNumber?: string | null;
    postalCode?: string;
  };
  agreedToTerms?: boolean;
  dob?: Date | null;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  sourceOfFunds?: string;
}

const validationSchema = yup
  .object({
    address: yup.object().shape({
      addressLine1: validateAddressLine1,
      city: validateCity,
      flatNumber: validateFlatNumber,
      houseName: validateHouseName,
      houseNumber: validateHouseNumber,
      postalCode: validatePostalCode,
    }),
    agreedToTerms: validateAgreedToTerms,
    dob: validateDob,
    email: validateEmail,
    firstName: validateFirstName,
    lastName: validateLastName,
    phoneNumber: validatePhoneNumberV2UsingIsValidPhoneNumber(),
    sourceOfFunds: validateSourceOfFunds,
  })
  .required();

export const RegistrationForm = ({
  initialValues,
  onSubmit,
}: {
  initialValues?: IRegistrationFormData;
  onSubmit: (formData: IRegistrationFormData) => void;
}) => {
  const TPLTermsAndConditionsRef = React.useRef<any>(null);
  const WhipAppTermsAndConditionsRef = React.useRef<any>(null);

  const emailRef = React.useRef<any>(null);
  const dobRef = React.useRef<any>(null);
  const firstNameRef = React.useRef<any>(null);
  const flatNumberRef = React.useRef<any>(null);
  const lastNameRef = React.useRef<any>(null);
  const phoneNumberRef = React.useRef<any>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IRegistrationFormData>({
    defaultValues: {
      address: {
        addressLine1: initialValues?.address?.addressLine1 || '',
        city: initialValues?.address?.city || '',
        flatNumber: initialValues?.address?.flatNumber || '',
        houseName: initialValues?.address?.houseName || '',
        houseNumber: initialValues?.address?.houseNumber || '',
        postalCode: initialValues?.address?.postalCode || '',
      },
      agreedToTerms: initialValues?.agreedToTerms || false,
      dob: initialValues?.dob,
      email: initialValues?.email || '',
      firstName: initialValues?.firstName || '',
      lastName: initialValues?.lastName || '',
      phoneNumber: initialValues?.phoneNumber || '',
      sourceOfFunds: initialValues?.sourceOfFunds || '',
    },
    resolver: yupResolver(validationSchema) as any,
  });

  const openTPLTermsAndConditions = React.useCallback(
    () => TPLTermsAndConditionsRef?.current?.onOpen(),
    [TPLTermsAndConditionsRef],
  );

  const openWhipAppTermsAndConditions = React.useCallback(
    () => WhipAppTermsAndConditionsRef?.current?.onOpen(),
    [WhipAppTermsAndConditionsRef],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <FormWrapper
        onSubmit={handleSubmit(onSubmit)}
        buttonLabel="Save"
      >
        <View style={{ gap: 16 }}>
          <View style={{ alignItems: 'center' }}>
            <CreateAccount height={120} style={{ marginBottom: 10 }} />
          </View>

          <View style={{ gap: 10, marginBottom: 10 }}>
            <Heading>Registration</Heading>
            <Paragraph>
              To start using yous Account and make payments with your Whips, you
              need to successfully register. It is easy and will only take a
              little of your time.
            </Paragraph>
          </View>

          <FormField
            control={control}
            name="firstName"
            title="First Name"
            validationSchema={validateFirstName}
            render={fieldProps => (
              <InputText
                autoComplete="given-name"
                onChange={value => fieldProps.onChange(value)}
                placeholder="Yeet"
                value={fieldProps.value}
                onBlur={fieldProps.onBlur}
                returnKeyType="next"
                ref={firstNameRef}
                onSubmitEditing={() => lastNameRef.current?.focus()}
                blurOnSubmit={false}
              />
            )}
          />

          <FormField
            control={control}
            name="lastName"
            title="Last Name"
            validationSchema={validateLastName}
            render={fieldProps => (
              <InputText
                autoComplete="family-name"
                onChange={value => fieldProps.onChange(value)}
                placeholder="McYeeterson"
                value={fieldProps.value}
                onBlur={fieldProps.onBlur}
                returnKeyType="next"
                ref={lastNameRef}
                onSubmitEditing={() => dobRef.current?.openDatePicker()}
                blurOnSubmit={false}
              />
            )}
          />

          <FormField
            control={control}
            name="email"
            title="Email"
            validationSchema={validateEmail}
            render={fieldProps => (
              <InputText
                autoComplete="email"
                disabled
                keyboardType="email-address"
                onBlur={fieldProps.onBlur}
                onChange={value => fieldProps.onChange(value)}
                placeholder="my@email.com"
                value={fieldProps.value}
                ref={emailRef}
              />
            )}
          />

          <FormField
            control={control}
            name="dob"
            title="Date of Birth"
            validationSchema={validateDob}
            render={fieldProps => {
              return (
                <DatePicker
                  maximumDate={add(new Date(), { years: -18 })}
                  minimumDate={add(new Date(), { years: -500 })}
                  onChange={fieldProps.onChange}
                  selectedDate={fieldProps.value}
                  ref={dobRef}
                />
              );
            }}
          />

          <FormField
            control={control}
            name="phoneNumber"
            title="Phone Number"
            description="Enter your UK mobile number."
            validationSchema={validatePhoneNumberV2UsingIsValidPhoneNumber()}
            render={fieldProps => {
              return (
                <PhoneNumberField
                  onChange={data => {
                    fieldProps.onChange(data?.value);
                  }}
                  onBlur={fieldProps.onBlur}
                  onSubmitEditing={() => flatNumberRef.current?.focus()}
                  ref={phoneNumberRef}
                  defaultValue={initialValues?.phoneNumber || ''}
                />
              );
            }}
          />

          <FormField
            control={control}
            name="address"
            title="Address"
            description="You can enter your postcode to look up your home address."
            validationSchema={yup.object().shape({
              addressLine1: validateAddressLine1,
              city: validateCity,
              flatNumber: validateFlatNumber,
              houseName: validateHouseName,
              houseNumber: validateHouseNumber,
              postalCode: validatePostalCode,
            }).required('Address is required')}
            render={fieldProps => (
              <AddressLookUp
                defaultInputValue={buildAddressString({
                  subBuildingName: initialValues?.address?.flatNumber,
                  buildingName: initialValues?.address?.houseName,
                  buildingNumber: initialValues?.address?.houseNumber,
                  thoroughfare: initialValues?.address?.addressLine1,
                  postTown: initialValues?.address?.city,
                  postcode: initialValues?.address?.postalCode,
                })}
                defaultValues={initialValues?.address}
                values={fieldProps.value}
                onChange={(address) => {
                  if (!address) {
                    return;
                  }
                  console.log('address', address);
                  fieldProps.onChange({
                    addressLine1: address?.thoroughfare,
                    city: address?.postTown,
                    flatNumber: address?.subBuildingName,
                    houseName: address?.buildingName,
                    houseNumber: address?.buildingNumber,
                    postalCode: address?.postcode,
                  });
                }}
              />
            )}
          />

          <FormField
            control={control}
            name="sourceOfFunds"
            title="Source of Funds"
            validationSchema={validateSourceOfFunds}
            render={fieldProps => {
              return (
                <InputSelect
                  onChange={value => fieldProps.onChange(value)}
                  options={[
                    { label: 'Salary', value: 'salary' },
                    { label: 'Savings', value: 'savings' },
                    { label: 'Investments Proceeds', value: 'investments' },
                    { label: 'Family Gift', value: 'family' },
                    { label: 'Property/Car Sale', value: 'property-car-sale' },
                  ]}
                  placeholder="How did you get your money?"
                  value={fieldProps.value}
                />
              );
            }}
          />

          <LineSeparator />

          <InputCheckbox
            control={control}
            label="By creating an account, you declare that you are over 18 years of age and agree to our terms:"
            name="agreedToTerms"
          />
          <View style={{ marginBottom: 0, marginTop: -15 }}>
            <FormFieldInlineError message={errors.agreedToTerms?.message} />
          </View>
          <Section>
            <BaseButtonInline onPress={openTPLTermsAndConditions}>
              TPL Terms and Conditions
            </BaseButtonInline>
            <BaseButtonInline onPress={openWhipAppTermsAndConditions}>
              WhipApp Terms and Conditions
            </BaseButtonInline>
          </Section>

          <View style={{ height: 0 }} />

          <TPLTermsAndConditions ref={TPLTermsAndConditionsRef} />
          <WhipAppTermsAndConditions ref={WhipAppTermsAndConditionsRef} />
        </View>
      </FormWrapper>
    </TouchableWithoutFeedback>

  );
};
