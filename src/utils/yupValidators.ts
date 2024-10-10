/* eslint-disable prettier/prettier */
import { parsePhoneNumber } from 'libphonenumber-js';
import * as yup from 'yup';

export const validateAddressLine1 = yup
  .string()
  .required('Address line 1 is required');
export const validateAddressLine2 = yup.string().notRequired();
export const validateAgreedToTerms = yup
  .boolean()
  .oneOf([true], 'You must agree to the terms and conditions');
export const validateCity = yup.string().required('City is required');
export const validateDob = yup.date().required('Date of birth is required');
export const validateEmail = yup
  .string()
  .email('Please enter a valid email')
  .required('Email is required');
export const validateFirstName = yup
  .string()
  .required('First name is required');
export const validateFlatNumber = yup.string().notRequired();
export const validateFullName = yup.string().required('Full Name is required');
export const validateHouseNumber = yup.string().notRequired();
export const validateHouseName = yup.string().notRequired();

export const validateLastName = yup.string().required('Last name is required');
export const validatePassword = yup.string().required('Password is required');
export const validatePhoneNumber = (enablePhoneNumber?: boolean) =>
  yup
    .string()
  [enablePhoneNumber ? 'required' : 'notRequired'](
    'Phone Number is required',
  );
export const validatePostalCode = yup
  .string()
  .required('Postal code is required');
export const validateSMSCode = yup.string().required('SMS Code is required');
export const validateSourceOfFunds = yup
  .string()
  .required('Source of funds is required');
export const validateChatMessage = yup.string().required('Message is required');

export const validatePhoneNumberV2UsingIsValidPhoneNumber = () => yup.string().test('phone', 'Please enter a valid phone number', (value) => {
  if (!value || value?.length < 5) return false;
  const parseDefaultValue = parsePhoneNumber(value);
  return parseDefaultValue.isValid();
});
