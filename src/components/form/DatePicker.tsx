import {
  HStack,
  Modal,
  ModalBackdrop,
  ModalContent,
  VStack
} from '@gluestack-ui/themed';
import DateTimePicker, {
  DateTimePickerAndroid
} from '@react-native-community/datetimepicker';
import { format, isDate } from 'date-fns';
import React, { useRef } from 'react';
import { Button, Platform, Pressable } from 'react-native';
import { Colors } from '../../theme/colors';
import { Paragraph } from '../Typography';
import { styles } from './styles';

export const DatePicker = React.forwardRef(
  (
    {
      disabled,
      maximumDate,
      minimumDate,
      onChange,
      selectedDate,
    }: {
      disabled?: boolean;
      maximumDate?: Date;
      minimumDate?: Date;
      onChange: (selectedDate: Date) => void;
      selectedDate: Date;
    },
    ref: React.Ref<any>
  ) => {
    const modalRef = useRef<any>(null);
    const dateTimePickerRef = useRef<any>(null);

    const [show, setShow] = React.useState(false);
    const [tempDate, setTempDate] = React.useState(selectedDate);

    React.useImperativeHandle(ref, () => ({
      openDatePicker: () => {
        if (Platform.OS === 'android') {
          dateTimePickerRef.current?.open({
            display: 'default',
          });
        } else {
          setShow(true);
        }
      },
      closeDatePicker: () => {
        setShow(false);
      },
    }));

    const handleChange = (_: any, selected: any) => {
      if (Platform.OS === 'ios') {
        setTempDate(selected);
      } else {
        onChange(selected);
        DateTimePickerAndroid.dismiss('date');
      }
    };

    const confirmDate = () => {
      setShow(false);
      onChange(tempDate);
    };

    const baseProps = {
      accentColor: Colors.brandSecondaryDark,
      maximumDate,
      minimumDate,
      onChange: handleChange,
      testID: 'dateTimePicker',
      textColor: Colors.paragraph,
      value:
        selectedDate && isDate(selectedDate)
          ? new Date(selectedDate)
          : isDate(tempDate)
            ? tempDate
            : new Date(),
    };

    const showDatePicker = () => {
      if (Platform.OS === 'android') {
        dateTimePickerRef.current?.open({
          ...baseProps,
          display: 'default',
        });
      } else {
        setShow(true);
      }
    };

    return (
      <>
        {Platform.OS === 'ios' ? (
          <Modal ref={modalRef} isOpen={show}>
            <ModalBackdrop />
            <ModalContent style={styles.iosModalContent}>
              <VStack space="md">
                <DateTimePicker
                  {...baseProps}
                  display={'inline'}
                  themeVariant="light"
                  testID="dateTimePicker"
                />
                <HStack justifyContent="space-between">
                  <Button onPress={() => setShow(false)} title="Cancel" />
                  <Button onPress={confirmDate} title="Confirm" />
                </HStack>
              </VStack>
            </ModalContent>
          </Modal>
        ) : null}
        <Pressable
          disabled={disabled}
          style={styles.dateContainer}
          onPress={showDatePicker}
        >
          <Paragraph
            color={
              selectedDate ? Colors.paragraph : Colors.muted
            }
          >
            {selectedDate
              ? format(new Date(selectedDate), 'dd/MM/yyyy')
              : 'Select Date'}
          </Paragraph>
        </Pressable>
      </>
    );
  }
);
