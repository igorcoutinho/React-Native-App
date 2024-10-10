import { StyleSheet } from 'react-native';
import { baseStyles } from '../../theme/baseStyles';

export const styles = StyleSheet.create({
  fabButton: {
    position: 'absolute',
    right: 27,
    transform: [{ scale: 1.3 }],
    ...baseStyles.elevationBase,
  },
});
