import { faAt } from '@fortawesome/free-solid-svg-icons';
import { VStack } from '@gluestack-ui/themed';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { DefaultValues, SubmitHandler, useForm } from 'react-hook-form';
import { View } from 'react-native';
import * as yup from 'yup';
import { BaseButton } from '../../../components/BaseButton';
import { FormField } from '../../../components/form/FormField';
import { InputText } from '../../../components/form/InputText';
import { validateEmail } from '../../../utils/yupValidators';
import { styles } from './styles';

interface IFormData {
  email: string;
}

interface IForgotPasswordFormProps {
  initialValues?: DefaultValues<IFormData>;
  onSubmit: SubmitHandler<IFormData>;
}

const validationSchema = yup.object({ email: validateEmail }).required();

export const ForgotPasswordForm = ({
  initialValues,
  onSubmit,
}: IForgotPasswordFormProps) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: initialValues?.email || '',
    },
    resolver: yupResolver(validationSchema),
  });

  return (
    <View style={styles.container}>
      <VStack space="4xl" width={'90%'}>
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
        <BaseButton onPress={handleSubmit(onSubmit)}>Submit</BaseButton>
      </VStack>
    </View>
  );
};
