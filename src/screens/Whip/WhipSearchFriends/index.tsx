import { yupResolver } from '@hookform/resolvers/yup';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Heading } from '../../../components/Typography';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { FormField } from '../../../components/form/FormField';
import { InputText } from '../../../components/form/InputText';
import { Size } from '../../../theme/sizes';
import { phoneNumberMask } from '../../../utils/masks';
import {
  validateEmail,
  validateFullName,
  validatePhoneNumber,
} from '../../../utils/yupValidators';

export interface IRegistrationFormData {
  email?: string;
  name?: string;
  phoneNumber?: string;
}

const validationSchema = yup
  .object({
    email: validateEmail,
    name: validateFullName,
    phoneNumber: validatePhoneNumber(true),
  })
  .required();

export const WhipSearchFriends = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IRegistrationFormData>({
    // defaultValues: {
    //   email: initialValues?.email || '',
    //   name: initialValues?.firstName || '',
    //   phoneNumber: initialValues?.phoneNumber || '',
    // },
    resolver: yupResolver(validationSchema) as any,
  });

  return (
    <>
      <ModalHeader action="back" />
      <MainContainer>
        <Section>
          <Heading>Invite a Friend</Heading>
        </Section>
        <LineSeparator />
        <Spacer size={Size.medium} />
        <Section>
          <FormField
            control={control}
            name="name"
            title="Name"
            validationSchema={validateFullName}
            render={fieldProps => (
              <InputText
                autoComplete="email"
                keyboardType="email-address"
                onBlur={fieldProps.onBlur}
                onChange={value => fieldProps.onChange(value)}
                placeholder="my@email.com"
                value={fieldProps.value}
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
                keyboardType="email-address"
                onBlur={fieldProps.onBlur}
                onChange={value => fieldProps.onChange(value)}
                placeholder="my@email.com"
                value={fieldProps.value}
              />
            )}
          />
          <FormField
            control={control}
            name="phoneNumber"
            title="Phone Number"
            validationSchema={validatePhoneNumber(true)}
            size={200}
            render={fieldProps => {
              return (
                <InputText
                  autoComplete="tel"
                  disabled
                  keyboardType="phone-pad"
                  onBlur={fieldProps.onBlur}
                  onChange={value => {
                    phoneNumberMask.resolve(value || '');
                    fieldProps.onChange(phoneNumberMask.value);
                  }}
                  placeholder="+## #### ### ####"
                  value={fieldProps.value}
                  blurOnSubmit={false}
                />
              );
            }}
          />
        </Section>
      </MainContainer>
      <FloatingBottom>
        <Section>
          <BaseButton variant="muted" onPress={() => navigation.goBack()}>
            Back
          </BaseButton>
        </Section>
      </FloatingBottom>
    </>
  );
};
