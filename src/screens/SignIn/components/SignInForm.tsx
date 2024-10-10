import {
  faAt,
  faEye,
  faEyeSlash,
  faLock,
  faMobileScreen,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { VStack } from '@gluestack-ui/themed';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import * as yup from 'yup';
import { BaseButton, BaseButtonInline } from '../../../components/BaseButton';
import { FormField } from '../../../components/form/FormField';
import { InputText } from '../../../components/form/InputText';
import { Colors } from '../../../theme/colors';
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
  enablePhoneNumberVerification?: boolean;
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

export const SignInForm = ({
  enablePhoneNumberVerification,
  onSubmit,
  onClickForgotPassword,
}: ISignInFormProps) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const { control, getValues, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema(enablePhoneNumberVerification)),
  });

  return (
    <View style={styles.container}>
      <VStack space="4xl" width={'90%'}>
        <VStack space="xl">
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
                leftIcon={faAt}
              />
            )}
          />

          <VStack space="sm">
            <FormField
              control={control}
              name="password"
              title="Password"
              validationSchema={validatePassword}
              render={fieldProps => (
                <InputText
                  autoComplete="current-password"
                  onBlur={fieldProps.onBlur}
                  onChange={value => fieldProps.onChange(value)}
                  placeholder="MyP@ssword!"
                  secureTextEntry={!showPassword ? true : false}
                  value={fieldProps.value}
                  leftIcon={faLock}
                  rightAccessory={
                    <Pressable
                      onPress={() => setShowPassword(showState => !showState)}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        color={Colors.brandSecondary}
                      />
                    </Pressable>
                  }
                />
              )}
            />

            <BaseButtonInline
              alignSelf="flex-end"
              onPress={() => onClickForgotPassword?.(getValues('email'))}
            >
              Forgot password?
            </BaseButtonInline>
          </VStack>

          {enablePhoneNumberVerification ? (
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
          ) : null}
        </VStack>
        <BaseButton onPress={handleSubmit(onSubmit)}>Sign In</BaseButton>
      </VStack>
    </View>
  );
};
