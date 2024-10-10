import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { VStack } from '@gluestack-ui/themed';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { View } from 'react-native';
import * as yup from 'yup';
import { BaseButton } from '../../../components/BaseButton';
import { FormField } from '../../../components/form/FormField';
import { InputText } from '../../../components/form/InputText';
import { validateSMSCode } from '../../../utils/yupValidators';
import { styles } from './styles';

interface IFormData {
  code: string;
}

interface IPhoneNumberVerificationFormProps {
  onSubmit: SubmitHandler<IFormData>;
}

const validationSchema = yup
  .object({
    code: validateSMSCode,
  })
  .required();

export const PhoneNumberVerificationForm = ({
  onSubmit,
}: IPhoneNumberVerificationFormProps) => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema),
  });

  return (
    <View style={styles.container}>
      <VStack space="4xl" width="95%">
        <FormField
          control={control}
          name="code"
          title="Verification Code"
          validationSchema={validateSMSCode}
          render={fieldProps => (
            <InputText
              keyboardType="number-pad"
              onBlur={fieldProps.onBlur}
              onChange={value => fieldProps.onChange(value)}
              placeholder="XXXXXX"
              value={fieldProps.value || ''}
              leftIcon={faHashtag}
            />
          )}
        />
        <BaseButton onPress={handleSubmit(onSubmit)}>Verify</BaseButton>
      </VStack>
    </View>
  );
};
