import { faRandom } from '@fortawesome/free-solid-svg-icons';
import { HStack, View } from '@gluestack-ui/themed';
import { yupResolver } from '@hookform/resolvers/yup';
import { add, differenceInDays } from 'date-fns';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, Switch } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as yup from 'yup';
import { BaseButtonIcon } from '../../components/BaseButton';
import { DoubleDatePicker } from '../../components/DoubleDatePicker';
import { Paragraph } from '../../components/Typography';
import { WhipTypeSelector } from '../../components/WhipTypeSelector';
import {
  IWhipType,
  WhipType,
  categories
} from '../../components/WhipTypeSelector/categories';
import { FormField } from '../../components/form/FormField';
import { FormFieldTitle } from '../../components/form/FormFieldTitle';
import { FormWrapper } from '../../components/form/FormWrapper';
import { InputText } from '../../components/form/InputText';
import { baseStyles } from '../../theme/baseStyles';
import { Colors } from '../../theme/colors';

export interface IWhipFormData {
  dates: {
    end: Date;
    start: Date;
  };
  infinity: boolean;
  name: string;
  category: IWhipType;
}

const validateWhipName = yup.string().required('Whip name is required');

const validationSchema = yup
  .object({
    category: yup
      .object({
        fontSize: yup.number().required(),
        icon: yup.string().required(),
        image: yup.string().required(),
        title: yup.string().required(),
        type: yup.mixed<WhipType>().oneOf(Object.values(WhipType)).required(),
      })
      .required(),
    dates: yup
      .object({
        end: yup.date().required(),
        start: yup.date().required(),
      })
      .required(),
    infinity: yup.boolean().required(),
    name: validateWhipName,
  })
  .required();

export const WhipForm = ({
  onSubmit,
  disabled,
  onCancel,
}: {
  onSubmit: (formData: IWhipFormData) => void;
  disabled: boolean;
  onCancel?: () => void;
}) => {
  const { control, watch, setValue, handleSubmit } = useForm<IWhipFormData>({
    defaultValues: {
      category: categories()[0],
      dates: {
        end: add(new Date(), { months: 1 }),
        start: new Date(),
      },
      infinity: true,
      name: '',
    },
    resolver: yupResolver(validationSchema) as any,
  });

  return (
    <FormWrapper buttonLabel="Save" onSubmit={handleSubmit(onSubmit)} disabled={disabled} onCancel={onCancel}>
      <View style={{ gap: 16 }}>
        <View
          style={{
            ...baseStyles.elevationBase,
          }}
        >
          <Animated.Image
            style={{
              backgroundColor: Colors.brandSecondary,
              // borderColor: Colors.brandSecondary,
              borderRadius: 12,
              // borderWidth: 2,
              height: 180,
              overflow: 'hidden',
              resizeMode: 'cover',
              width: '100%',
            }}
            source={{ uri: watch().category?.image }}
            entering={FadeIn}
            exiting={FadeOut}
          />
          {watch().category?.type === WhipType.Event ? (
            <BaseButtonIcon
              onPress={() => setValue('category', categories()[0])}
              icon={faRandom}
              variant="secondary"
              style={{
                bottom: 10,
                position: 'absolute',
                right: 10,
              }}
            />
          ) : null}
        </View>

        <FormField<IWhipFormData>
          control={control}
          name="name"
          title="Whip Name"
          validationSchema={validateWhipName}
          render={fieldProps => (
            <InputText
              onChange={value => fieldProps.onChange(value)}
              placeholder="Whip Name"
              value={fieldProps.value}
              onBlur={fieldProps.onBlur}
            />
          )}
        />

        <View>
          <HStack
            alignItems="center"
            justifyContent="space-between"
            style={{ marginBottom: 5 }}
          >
            <FormFieldTitle title="Duration" />
            <Controller
              name="infinity"
              control={control}
              render={({ field: { ...fieldProps } }) => {
                return (
                  <HStack alignItems="center">
                    <Paragraph
                      color={
                        fieldProps.value
                          ? Colors.brandSecondaryDark
                          : Colors.grey
                      }
                    >
                      Not set
                    </Paragraph>
                    <Switch
                      trackColor={{
                        false: Colors.grey,
                        true: Colors.brandSecondary,
                      }}
                      thumbColor={
                        fieldProps.value
                          ? Colors.brandSecondaryDark
                          : Colors.white
                      }
                      ios_backgroundColor={Colors.grey}
                      onValueChange={value => fieldProps.onChange(value)}
                      value={Boolean(fieldProps.value)}
                      style={{
                        transform:
                          Platform.OS === 'ios'
                            ? [{ scaleX: 0.6 }, { scaleY: 0.6 }]
                            : [{ scaleX: 1 }, { scaleY: 1 }],
                      }}
                    />
                  </HStack>
                );
              }}
            />
          </HStack>
          <Controller
            name="dates"
            control={control}
            render={({ field: { ...fieldProps } }) => {
              return (
                <DoubleDatePicker
                  disabled={watch()?.infinity}
                  onChange={dates => {
                    const end =
                      differenceInDays(dates.end, dates.start) <= 1
                        ? add(dates.start, {
                          days: 1,
                        })
                        : dates.end;
                    fieldProps.onChange({ ...dates, end });
                  }}
                  selectedDates={{
                    end: fieldProps.value?.end,
                    start: fieldProps.value?.start,
                  }}
                />
              );
            }}
          />
        </View>

        <FormField<IWhipFormData>
          control={control}
          name="category"
          title="Type"
          validationSchema={validateWhipName}
          render={fieldProps => (
            <WhipTypeSelector
              selected={fieldProps?.value}
              onChange={value => fieldProps.onChange(value)}
              types={categories()}
            />
          )}
        />
      </View>
    </FormWrapper>
  );
};
