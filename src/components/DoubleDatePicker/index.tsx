import {
  HStack,
  Modal,
  ModalBackdrop,
  ModalContent,
  VStack,
} from '@gluestack-ui/themed';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { add, format } from 'date-fns';
import { ArrowRightIcon, InfinityIcon } from 'lucide-react-native';
import React from 'react';
import { Button, Platform, Pressable, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { styles } from './styles';

const DatePicker = ({
  disabled,
  label,
  minimumDate = new Date(),
  onDateChange,
  selectedDate = new Date(),
}: {
  disabled?: boolean;
  label: string;
  minimumDate: Date | null;
  onDateChange: (selectedDate: Date) => void;
  selectedDate: Date;
}) => {
  const [show, setShow] = React.useState(false);
  const [tempDate, setTempDate] = React.useState(selectedDate);

  const onChange = (_: any, selected: any) => {
    if (Platform.OS === 'ios') {
      setTempDate(selected);
    } else {
      onDateChange(selected);
      DateTimePickerAndroid.dismiss('date');
    }
  };

  const confirmDate = () => {
    setShow(false);
    onDateChange(tempDate);
  };

  const baseProps = {
    accentColor: Colors.brandSecondaryDark,
    minimumDate: minimumDate || new Date(),
    onChange,
    testID: 'dateTimePicker',
    textColor: Colors.paragraph,
    value: selectedDate,
  };

  const showDatePicker = () => {
    Platform.OS === 'android'
      ? DateTimePickerAndroid.open({
          ...baseProps,
          display: 'default',
        })
      : setShow(true);
  };

  return (
    <>
      {Platform.OS === 'ios' ? (
        <Modal isOpen={show}>
          <ModalBackdrop />
          <ModalContent style={styles.iosModalContent}>
            <VStack space="md">
              <DateTimePicker
                {...baseProps}
                display={'inline'}
                themeVariant="light"
              />
              <HStack justifyContent="space-between">
                <Button onPress={() => setShow(false)} title="Cancel" />
                <Button onPress={confirmDate} title="Confirm" />
              </HStack>
            </VStack>
          </ModalContent>
        </Modal>
      ) : null}
      <HStack justifyContent="space-between">
        {disabled ? (
          <View style={styles.dateContainer}>
            <InfinityIcon
              width={60}
              height={60}
              color={Colors.brandSecondary}
            />
          </View>
        ) : (
          <Pressable style={styles.dateContainer} onPress={showDatePicker}>
            <VStack>
              <Text style={styles.dateLabel}>{label}</Text>
              <Text style={styles.dateDay}>{format(selectedDate, 'dd')}</Text>
              <Text style={styles.dateMonth}>
                {format(selectedDate, 'MMMM')}
              </Text>
            </VStack>
          </Pressable>
        )}
      </HStack>
    </>
  );
};

export const DoubleDatePicker = ({
  disabled,
  onChange,
  selectedDates = {
    end: add(new Date(), {
      months: 1,
    }),
    start: new Date(),
  },
}: {
  disabled?: boolean;
  onChange: (dates: { start: Date; end: Date }) => void;
  selectedDates: { start: Date; end: Date };
}) => {
  return (
    <HStack space="lg" justifyContent="center" alignItems="center">
      <DatePicker
        disabled={disabled}
        label="Start At"
        minimumDate={new Date()}
        onDateChange={selectedDate => {
          onChange({
            end: selectedDates.end,
            start: selectedDate,
          });
        }}
        selectedDate={selectedDates.start}
      />
      {!disabled ? (
        <ArrowRightIcon width={30} height={30} color={Colors.brand} />
      ) : (
        <InfinityIcon width={30} height={30} color={Colors.grey} />
      )}
      <DatePicker
        disabled={disabled}
        label="End At"
        minimumDate={selectedDates.start}
        onDateChange={selectedDate => {
          onChange({
            end: selectedDate,
            start: selectedDates.start,
          });
        }}
        selectedDate={selectedDates.end}
      />
    </HStack>
  );
};
