import { yupResolver } from '@hookform/resolvers/yup';
import { maskitoTransform } from '@maskito/core';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { BaseButton } from '../../../../components/BaseButton';
import { Section } from '../../../../components/elements/Section';
import { Spacer } from '../../../../components/elements/Spacer';
import { FormField } from '../../../../components/form/FormField';
import { InputText } from '../../../../components/form/InputText';
import { Bold, Heading, Paragraph } from '../../../../components/Typography';
import { useWhipContext } from '../../../../states/Whip';
import { Size } from '../../../../theme/sizes';
import {
  validateEmail,
  validateFullName
} from '../../../../utils/yupValidators';

export interface IInviteFriendFormData {
  email?: string;
  displayName?: string;
  budget?: string;
}

const validationSchema = yup
  .object({
    email: validateEmail,
    displayName: validateFullName,
  })
  .required();

export const InviteFriendForm = ({
  onConfirm,
  onCancel,
  values,
  fromSearchFriend,
}: {
  onConfirm?: (contact: IInviteFriendFormData) => void;
  onCancel?: () => void;
  values?: IInviteFriendFormData;
  fromSearchFriend?: boolean;
}) => {
  const { whip } = useWhipContext();

  const { control, handleSubmit } = useForm<IInviteFriendFormData>({
    values,
    resolver: yupResolver(validationSchema) as any,
  });

  return (
    <Section space={Size.xLarge}>
      <Section>
        <Heading>New friend</Heading>
        <Paragraph>
          Add a friend to <Bold>{whip?.name}</Bold>
        </Paragraph>
      </Section>
      <Section>
        <FormField
          control={control}
          name="displayName"
          title="Name"
          validationSchema={validateFullName}
          render={fieldProps => (
            <InputText
              autoComplete="name"
              keyboardType="default"
              onBlur={fieldProps.onBlur}
              onChange={value => fieldProps.onChange(value)}
              placeholder="Yeet McYeeterson"
              value={fieldProps.value}
            />
          )}
        />
        {!fromSearchFriend &&
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
        }

        <FormField
          control={control}
          name="budget"
          title="Budget (Empty for unlimited)"
          size={220}
          render={fieldProps => (
            <InputText
              keyboardType="numbers-and-punctuation"
              onBlur={fieldProps.onBlur}
              onChange={value => {
                const masked = maskitoTransform(
                  value || '',
                  maskitoNumberOptionsGenerator({
                    prefix: '£ ',
                    decimalSeparator: '.',
                    thousandSeparator: ',',
                    min: 0,
                    precision: 2,
                  }),
                );
                fieldProps.onChange(masked);
              }}
              placeholder="£"
              value={fieldProps.value}
            />
          )}
        />
      </Section>
      <Spacer size={Size.x2Small} />
      <Section direction="row">
        <BaseButton grow onPress={handleSubmit(onConfirm)}>
          Confirm
        </BaseButton>
        <BaseButton variant="muted" onPress={onCancel}>
          Cancel
        </BaseButton>
      </Section>
    </Section>
  );
};
