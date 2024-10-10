import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { baseStyles } from './../../theme/baseStyles';

export const styles = StyleSheet.create({
  dateContainer: {
    width: 110,
    height: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.greyLight,
    borderWidth: 1,
    ...baseStyles.elevationBase,
  },
  dateLabel: {
    fontSize: 10,
    textAlign: 'center',
    color: Colors.grey,
  },
  dateDay: {
    fontSize: 52,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -10,
    marginBottom: -10,
    color: Colors.brandSecondary,
  },
  dateMonth: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.brandSecondaryDark,
  },
  iosModalContent: {
    padding: 10,
    paddingHorizontal: 20,
  },
  iconPlaceholder: {
    height: 30,
  },
});
