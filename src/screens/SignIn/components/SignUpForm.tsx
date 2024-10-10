import {
  faAt,
  faEye,
  faEyeSlash,
  faLock,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { VStack } from '@gluestack-ui/themed';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import * as yup from 'yup';
import { BaseButton } from '../../../components/BaseButton';
import { DialogV2 } from '../../../components/DialogV2';
import { Heading, Paragraph } from '../../../components/Typography';
import { Box, Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { FormField } from '../../../components/form/FormField';
import { InputText } from '../../../components/form/InputText';
import { PhoneNumberField } from '../../../components/form/PhoneNumberField';
import { Colors } from '../../../theme/colors';
import { Size } from '../../../theme/sizes';
import {
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhoneNumberV2UsingIsValidPhoneNumber
} from '../../../utils/yupValidators';
import { styles } from './styles';

interface IFormData {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
}

interface ISignUpFormProps {
  onSubmit: SubmitHandler<IFormData>;
  onClickForgotPassword?: (currentEmail?: string) => void;
}

const validationSchema = yup
  .object({
    email: validateEmail,
    fullName: validateFullName,
    password: validatePassword,
    phoneNumber: validatePhoneNumberV2UsingIsValidPhoneNumber(),
  })
  .required();

export const SignUpForm = ({ onSubmit }: ISignUpFormProps) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [visible, setVisible] = React.useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      // phoneNumber: '+44',
    },
    resolver: yupResolver(validationSchema),
  });

  return (
    <View style={styles.container}>
      <VStack space="4xl" width={'90%'}>
        <VStack space="xl">
          <FormField
            control={control}
            name="fullName"
            title="Full Name"
            validationSchema={validateFullName}
            render={fieldProps => (
              <InputText
                autoComplete="name"
                onBlur={fieldProps.onBlur}
                onChange={value => fieldProps.onChange(value)}
                placeholder="Yeet McYeeterson"
                value={fieldProps.value}
                leftIcon={faUser}
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
                onChange={value => fieldProps.onChange(value?.toLowerCase?.() || '')}
                placeholder="my@email.com"
                value={fieldProps.value}
                leftIcon={faAt}
              />
            )}
          />

          <FormField
            control={control}
            name="password"
            title="Create Password"
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
                />
              );
            }}
          />

          {/* <FormField
            control={control}
            name="phoneNumber"
            title="Phone Number"
            validationSchema={validatePhoneNumberV2UsingIsValidPhoneNumber()}
            render={fieldProps => {
              return (
                <InputText
                  autoComplete="tel"
                  keyboardType="phone-pad"
                  rightAccessory={
                    <BaseButton flatten variant="transparent" onPress={() => setVisible(true)} style={{
                      padding: 0,
                      marginRight: -10,
                    }}>
                      <Bold color={Colors.blue}>Need help?</Bold>
                    </BaseButton>
                  }
                  onChange={value => {
                    fieldProps.onChange(formatPhoneNumber(value));
                  }}
                  value={fieldProps.value}
                  placeholder="+44 #### #######"
                  onBlur={fieldProps.onBlur}
                  leftIcon={faMobileScreen}
                />
              );
            }}
          /> */}

        </VStack>

        <DialogV2
          autoHeight
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <>
            <Box space={Size.xLarge} color="transparent">
              <Section>
                <Heading>
                  Phone Number
                </Heading>
                <Paragraph>
                  1. We only accept UK phone numbers.
                </Paragraph>
                <Paragraph>
                  2. The Country Code is already set to +44.
                </Paragraph>
                <Paragraph>
                  3. Try to remove leading zeros.
                </Paragraph>
              </Section>
              <Spacer size={Size.large} />
              <BaseButton
                variant="muted"
                onPress={() => setVisible(false)}
                fullWidth
              >
                Got it!
              </BaseButton>
            </Box>
          </>
        </DialogV2>

        <BaseButton onPress={handleSubmit(onSubmit)}>Sign Up</BaseButton>
      </VStack>
    </View>
  );
};
