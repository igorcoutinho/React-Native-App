import { View } from '@gluestack-ui/themed';
import React from 'react';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues
} from 'react-hook-form';
import * as yup from 'yup';
import { FormFieldInlineError } from '../../components/form/FormFieldInlineError';
import { FormFieldTitle } from '../../components/form/FormFieldTitle';
import { Colors } from '../../theme/colors';
import { Size } from '../../theme/sizes';
import { Paragraph } from '../Typography';

interface IProps<T extends FieldValues> {
  children?:
  | unknown
  | React.ReactElement
  | ((fieldProps: ControllerRenderProps) => React.ReactElement);
  control: Control<T, any>;
  name: string;
  render?: (fieldProps: ControllerRenderProps) => React.ReactElement;
  title: string;
  description?: string;
  validationSchema?: yup.Schema;
  size?: number;
}

export function FormField<T extends FieldValues>({
  children,
  control,
  name,
  render,
  title,
  description,
  validationSchema,
  size,
}: IProps<T>) {
  // const renderValidationStatus = (
  //   fieldProps: ControllerRenderProps,
  //   fieldState: ControllerFieldState,
  // ) => {
  //   return validationSchema ? (
  //     validationSchema.isValidSync(fieldProps.value) && !fieldState.error?.message ? (
  //       <StatusIndicator
  //         animated={false}
  //         variant="success"
  //         visible={fieldState.isTouched}
  //       />
  //     ) : (
  //       <StatusIndicator
  //         variant="danger"
  //         visible={Boolean(fieldState.error?.message || fieldState.isTouched)}
  //       />
  //     )
  //   ) : null;
  // };

  return (
    <Controller
      name={name}
      control={control as unknown as Control<FieldValues, T>}
      render={({ field: { ...fieldProps }, fieldState }) => (
        <View
          style={{
            width: size,
          }}
        >
          <View style={{ flexDirection: 'row', marginBottom: 2 }}>
            <FormFieldTitle title={title} />
            {/* {renderValidationStatus(fieldProps, fieldState)} */}
          </View>
          {description && <Paragraph color={Colors.mutedDark} size={Size.xSmall} style={{ marginBottom: 5 }}>{description}</Paragraph>}
          {typeof children === 'function'
            ? children(fieldProps as ControllerRenderProps)
            : children}
          {render?.(fieldProps)}
          <FormFieldInlineError message={fieldState.error?.message ? fieldState.error?.message : Object.keys(fieldState?.error || {}).length ? 'Enter a valid Post Code' : null} />
        </View>
      )}
    />
  );
}
