import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as yup from 'yup';
import { BaseButton } from '../../../../components/BaseButton';
import TextArea from '../../../../components/TextArea/TextArea';
import { Paragraph } from '../../../../components/Typography';
import { Section } from '../../../../components/elements/Section';
import { Spacer } from '../../../../components/elements/Spacer';
import { FormField } from '../../../../components/form/FormField';
import { Size } from '../../../../theme/sizes';
import {
  validateChatMessage
} from '../../../../utils/yupValidators';

export interface IChatFormData {
  message?: string;
}

const validationSchema = yup
  .object({
    message: validateChatMessage,
  })
  .required();

export const ChatForm = ({
  onConfirm,
  values
}: {
  onConfirm?: (chat: IChatFormData) => void;
  values?: IChatFormData;
}) => {

  const { control, handleSubmit, reset } = useForm<IChatFormData>({
    values,
    resolver: yupResolver(validationSchema) as any,
  });


  const onSubmit = (data: IChatFormData) => {
    if (onConfirm) {
      onConfirm(data);
      reset();
    }
  };

  return (
    <Section>
      <FormField
        control={control}
        name="message"
        title=""
        validationSchema={validateChatMessage}
        render={fieldProps => (
          <TextArea
            text={fieldProps.value}
            setText={value => fieldProps.onChange(value)}
            showCount
            maxLength={200}
          />
        )}
      />

      <BaseButton alignSelf='flex-end' variant='secondary' flatten
        onPress={handleSubmit(onSubmit)}
        style={{ position: 'absolute', bottom: 5, right: 10 }}
      >
        <Section direction="row" align="center">
          <Paragraph color={Colors.white}>Send</Paragraph>
        </Section>
      </BaseButton>
      <Spacer size={Size.xSmall} />
    </Section>
  );
};
