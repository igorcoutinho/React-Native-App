import { faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { VStack } from '@gluestack-ui/themed';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { View } from 'react-native';
import * as yup from 'yup';
import { BaseButton } from '../../../components/BaseButton';
import { FormField } from '../../../components/form/FormField';
import { InputText } from '../../../components/form/InputText';
import { phoneNumberMask } from '../../../utils/masks';
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from '../../../utils/yupValidators';
import { styles } from './styles';

interface IFormData {
  email: string;
  password: string;
  phoneNumber?: string | null;
}

interface ISignInFormProps {
  enablePhoneNumberVerification: boolean;
  onSubmit: SubmitHandler<IFormData>;
  onClickForgotPassword?: (currentEmail?: string) => void;
}

const validationSchema = (enablePhoneNumber?: boolean) =>
  yup
    .object({
      email: validateEmail,
      password: validatePassword,
      phoneNumber: validatePhoneNumber(enablePhoneNumber),
    })
    .required();

export const PhoneNumberForm = ({
  enablePhoneNumberVerification,
  onSubmit,
}: ISignInFormProps) => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema(enablePhoneNumberVerification)),
  });

  return (
    <View style={styles.container}>
      <VStack space="4xl" width={'90%'}>
        <VStack space="xl">
          <FormField
            control={control}
            name="phoneNumber"
            title="Phone Number"
            validationSchema={validatePhoneNumber(
              enablePhoneNumberVerification,
            )}
            render={fieldProps => {
              phoneNumberMask.resolve(fieldProps.value || '');
              return (
                <InputText
                  autoComplete="tel"
                  keyboardType="phone-pad"
                  onBlur={fieldProps.onBlur}
                  onChange={value => fieldProps.onChange(value)}
                  placeholder="+## #### ### ####"
                  value={phoneNumberMask.value}
                  leftIcon={faMobileScreen}
                />
              );
            }}
          />
        </VStack>
        <BaseButton onPress={handleSubmit(onSubmit)}>Confirm</BaseButton>
      </VStack>
    </View>
  );
};
