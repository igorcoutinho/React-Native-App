import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 30,
    width: '100%',
    backgroundColor: Colors.appBackgroundColor,
    zIndex: -1,
  },
});
