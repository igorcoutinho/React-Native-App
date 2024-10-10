import {
  faMobileScreen
} from '@fortawesome/free-solid-svg-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { BaseButton } from '../../components/BaseButton';
import { Heading } from '../../components/Typography';
import { Section } from '../../components/elements/Section';
import { Spacer } from '../../components/elements/Spacer';
import { FormField } from '../../components/form/FormField';
import { InputText } from '../../components/form/InputText';
import { Size } from '../../theme/sizes';
import { phoneNumberMask } from '../../utils/masks';
import { validatePhoneNumber } from '../../utils/yupValidators';

interface IFormData {
  phoneNumber?: string | null;
}

interface IPhoneNumberFormProps {
  enablePhoneNumberVerification?: boolean;
  onSubmit: SubmitHandler<IFormData>;
  onCancel: () => void;
  onClickForgotPassword?: (currentEmail?: string) => void;
}

const validationSchema = (enablePhoneNumber?: boolean) =>
  yup
    .object({
      phoneNumber: validatePhoneNumber(enablePhoneNumber),
    })
    .required();

export const PhoneNumberForm = ({
  enablePhoneNumberVerification,
  onSubmit,
  onCancel
}: IPhoneNumberFormProps) => {

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema(enablePhoneNumberVerification)),
  });

  return (
    <Section space={Size.xLarge}>

      <Section>
        <Heading>Change Phone Number</Heading>
      </Section>

      <Spacer size={Size.large} />

      <Section>
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
      </Section>
      <Spacer size={Size.large} />

      <Section direction="row">
        <BaseButton grow onPress={handleSubmit(onSubmit)}>
          Confirm
        </BaseButton>
        <BaseButton variant="muted" onPress={onCancel}>
          Cancel
        </BaseButton>
      </Section>
    </Section>
  );
};
